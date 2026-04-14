"use client";

import { del, get, keys, set } from "idb-keyval";

const BASE_KEY = "cv:base";
const BASE_NAME_KEY = "cv:base:name";
const jobKey = (jobId: string) => `cv:job:${jobId}`;
const jobNameKey = (jobId: string) => `cv:job:${jobId}:name`;

export interface StoredCv {
  blob: Blob;
  fileName: string;
}

async function readCv(key: string, nameKey: string): Promise<StoredCv | null> {
  const blob = await get<Blob>(key);
  if (!blob) return null;
  const fileName = (await get<string>(nameKey)) ?? "resume.docx";
  return { blob, fileName };
}

async function writeCv(
  key: string,
  nameKey: string,
  blob: Blob,
  fileName: string
): Promise<void> {
  await set(key, blob);
  await set(nameKey, fileName);
}

export function getBaseCv(): Promise<StoredCv | null> {
  return readCv(BASE_KEY, BASE_NAME_KEY);
}

export function setBaseCv(blob: Blob, fileName: string): Promise<void> {
  return writeCv(BASE_KEY, BASE_NAME_KEY, blob, fileName);
}

export async function deleteBaseCv(): Promise<void> {
  await del(BASE_KEY);
  await del(BASE_NAME_KEY);
}

export function getJobCv(jobId: string): Promise<StoredCv | null> {
  return readCv(jobKey(jobId), jobNameKey(jobId));
}

export function setJobCv(
  jobId: string,
  blob: Blob,
  fileName: string
): Promise<void> {
  return writeCv(jobKey(jobId), jobNameKey(jobId), blob, fileName);
}

export async function deleteJobCv(jobId: string): Promise<void> {
  await del(jobKey(jobId));
  await del(jobNameKey(jobId));
}

export async function cloneBaseToJob(jobId: string): Promise<StoredCv | null> {
  const base = await getBaseCv();
  if (!base) return null;
  await setJobCv(jobId, base.blob, base.fileName);
  return base;
}

export async function listJobCvIds(): Promise<string[]> {
  const all = await keys();
  const prefix = "cv:job:";
  return all
    .filter(
      (k): k is string =>
        typeof k === "string" && k.startsWith(prefix) && !k.endsWith(":name")
    )
    .map((k) => k.slice(prefix.length));
}

export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, {
    type:
      blob.type ||
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}
