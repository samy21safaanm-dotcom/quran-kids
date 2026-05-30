import type { NextApiRequest, NextApiResponse } from 'next';
import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from '@aws-sdk/client-transcribe';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import formidable from 'formidable';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const REGION = process.env.AWS_REGION || 'us-east-1';
const BUCKET = 'quran-kids-transcribe'; // يمكنك تغييره من لوحة AWS

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const transcribe = new TranscribeClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function uploadToS3(filePath: string, fileName: string) {
  const fileContent = fs.readFileSync(filePath);
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: fileName,
    Body: fileContent,
    ContentType: 'audio/webm',
  }));
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const form = formidable({ uploadDir: './', keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'File upload error' });
      // دعم حالة أن files.audio مصفوفة أو كائن مفرد
      let file = (files.audio as formidable.File | formidable.File[]);
      if (Array.isArray(file)) {
        file = file[0];
      }

      // لوج مفصل لمحتوى الملفات والحقول
      console.log('==== formidable fields:', fields);
      console.log('==== formidable files:', files);
      if (files && Object.keys(files).length > 0) {
        for (const [key, f] of Object.entries(files)) {
          console.log(`==== file[${key}]:`, f);
        }
      } else {
        console.log('==== لا يوجد ملفات في الطلب');
      }

      const filePath = (file as any)?.filepath || (file as any)?.path;
      if (!filePath) return res.status(500).json({ error: 'لم يتم العثور على مسار الملف الصوتي (filepath/path) في الملف المرفوع.' });
    const fileName = `audio-${Date.now()}.webm`;
    try {
      // 1. رفع الملف إلى S3
      const s3Url = await uploadToS3(filePath, fileName);
      // 2. بدء مهمة Transcribe
      const jobName = `job-${Date.now()}`;
      await transcribe.send(new StartTranscriptionJobCommand({
        TranscriptionJobName: jobName,
        LanguageCode: 'ar-SA',
        Media: { MediaFileUri: s3Url },
        OutputBucketName: BUCKET,
        MediaFormat: 'webm',
      }));
      // 3. الانتظار حتى انتهاء المهمة (polling)
      let transcript = '';
      for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 5000));
        const job = await transcribe.send(new GetTranscriptionJobCommand({ TranscriptionJobName: jobName }));
        if (job.TranscriptionJob?.TranscriptionJobStatus === 'COMPLETED') {
          const url = job.TranscriptionJob.Transcript?.TranscriptFileUri;
          if (url) {
            const resp = await fetch(url);
            const data = await resp.json();
            transcript = data.results.transcripts[0]?.transcript || '';
            break;
          }
        }
        if (job.TranscriptionJob?.TranscriptionJobStatus === 'FAILED') {
          return res.status(500).json({ error: 'Transcribe job failed' });
        }
      }
      if (!transcript) return res.status(500).json({ error: 'Transcription timeout' });
      res.json({ transcript });
    } catch (e) {
      console.error('Transcribe API error:', e);
      if (e instanceof Error) {
        res.status(500).json({ error: e.message, stack: e.stack });
      } else {
        res.status(500).json({ error: JSON.stringify(e) });
      }
    }
  });
}
