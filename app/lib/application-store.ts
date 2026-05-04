import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { countWords, scoreCandidate } from "./application-scoring";

export type CandidateStatus = "pending" | "reviewed" | "shortlisted" | "rejected";

export type CandidateApplication = {
  adminNotes: string;
  career: string;
  classification: string;
  coordination: string;
  createdAt: string;
  currentProjectAnswer: string;
  cvFileName: string;
  cvFileUrl: string;
  cvStorageKey: string;
  email: string;
  fullName: string;
  id: string;
  phone: string;
  progressAnswer: string;
  projectLink: string;
  scoreClarity: number;
  scoreCommitment: number;
  scoreCommunication: number;
  scoreEvidence: number;
  scoreFit: number;
  scoreInitiative: number;
  scoreTotal: number;
  status: CandidateStatus;
  wordCount: number;
};

type CreateCandidateInput = {
  career: string;
  coordination: string;
  currentProjectAnswer: string;
  cvBuffer: Buffer;
  cvFileName: string;
  email: string;
  fullName: string;
  phone: string;
  progressAnswer: string;
  projectLink: string;
};

const dataDirectory = path.join(process.cwd(), ".data");
const cvDirectory = path.join(dataDirectory, "candidate-cvs");
const databasePath = path.join(dataDirectory, "candidate-applications.json");

export async function createCandidateApplication(input: CreateCandidateInput) {
  await ensureStorage();

  const id = randomUUID();
  const extension = path.extname(input.cvFileName) || ".pdf";
  const cvStorageKey = `${id}${extension}`;
  const cvPath = path.join(cvDirectory, cvStorageKey);
  const scores = scoreCandidate({
    coordination: input.coordination,
    currentProjectAnswer: input.currentProjectAnswer,
    progressAnswer: input.progressAnswer,
    projectLink: input.projectLink,
  });
  const candidate: CandidateApplication = {
    ...scores,
    adminNotes: "",
    career: input.career,
    coordination: input.coordination,
    createdAt: new Date().toISOString(),
    currentProjectAnswer: input.currentProjectAnswer,
    cvFileName: input.cvFileName,
    cvFileUrl: `/api/admin/cv/${id}`,
    cvStorageKey,
    email: input.email,
    fullName: input.fullName,
    id,
    phone: input.phone,
    progressAnswer: input.progressAnswer,
    projectLink: input.projectLink,
    status: "pending",
    wordCount: countWords(input.currentProjectAnswer),
  };

  await writeFile(cvPath, input.cvBuffer);

  const candidates = await listCandidateApplications();
  candidates.unshift(candidate);
  await saveCandidateApplications(candidates);

  return candidate;
}

export async function listCandidateApplications() {
  await ensureStorage();

  try {
    const raw = await readFile(databasePath, "utf8");
    return JSON.parse(raw) as CandidateApplication[];
  } catch {
    return [];
  }
}

export async function getCandidateApplication(id: string) {
  const candidates = await listCandidateApplications();

  return candidates.find((candidate) => candidate.id === id) ?? null;
}

export async function updateCandidateApplication(
  id: string,
  updates: Partial<Pick<CandidateApplication, "adminNotes" | "status">>,
) {
  const candidates = await listCandidateApplications();
  const index = candidates.findIndex((candidate) => candidate.id === id);

  if (index < 0) {
    return null;
  }

  candidates[index] = {
    ...candidates[index],
    ...updates,
  };
  await saveCandidateApplications(candidates);

  return candidates[index];
}

export async function getCandidateCvPath(id: string) {
  const candidate = await getCandidateApplication(id);

  if (!candidate) {
    return null;
  }

  return {
    candidate,
    filePath: path.join(cvDirectory, candidate.cvStorageKey),
  };
}

async function ensureStorage() {
  await mkdir(cvDirectory, { recursive: true });

  try {
    await readFile(databasePath, "utf8");
  } catch {
    await writeFile(databasePath, "[]");
  }
}

async function saveCandidateApplications(candidates: CandidateApplication[]) {
  await ensureStorage();
  await writeFile(databasePath, JSON.stringify(candidates, null, 2));
}
