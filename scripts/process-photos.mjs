import sharp from "sharp";
import convert from "heic-convert";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const OUT = path.resolve(import.meta.dirname, "..", "public", "photos");

const jobs = [
  // Alessandra portraits
  { src: "drive-download-20260812T121813Z-1-001/F145CA10-E4B4-4F73-BEF8-1BF265FBA432.heic", out: "alessandra-1", heic: true },
  { src: "drive-download-20260812T121813Z-1-001/IMG_8739.JPG", out: "alessandra-2" },
  { src: "drive-download-20260812T121813Z-1-001/IMG_8741.JPG", out: "alessandra-3" },
  { src: "drive-download-20260812T121813Z-1-001/IMG_8752.JPG", out: "alessandra-4" },
  { src: "drive-download-20260812T121813Z-1-001/IMG_8753.JPG", out: "alessandra-5" },
  // Damata restaurant
  { src: "drive-download-20260812T130621Z-1-001/IMG_7848.jpg", out: "damata-1" },
  { src: "drive-download-20260812T130621Z-1-001/IMG_7851.jpg", out: "damata-2" },
  { src: "drive-download-20260812T130621Z-1-001/IMG_7852.jpg", out: "damata-3" },
  { src: "drive-download-20260812T130621Z-1-001/IMG_7857.jpg", out: "damata-4" },
  { src: "drive-download-20260812T130621Z-1-001/IMG_7876.jpg", out: "damata-5" },
];

const SIZES = [
  { suffix: "", width: 1600 },
  { suffix: "-sm", width: 800 },
];

await fs.mkdir(OUT, { recursive: true });

for (const job of jobs) {
  const inputPath = path.join(ROOT, job.src);
  let buffer = await fs.readFile(inputPath);

  if (job.heic) {
    buffer = Buffer.from(await convert({ buffer, format: "JPEG", quality: 0.95 }));
  }

  const meta = await sharp(buffer).metadata();
  console.log(job.out, meta.width, "x", meta.height);

  for (const size of SIZES) {
    const img = sharp(buffer).rotate().resize({ width: size.width, withoutEnlargement: true });
    await img.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, `${job.out}${size.suffix}.jpg`));
    await img.clone().webp({ quality: 80 }).toFile(path.join(OUT, `${job.out}${size.suffix}.webp`));
  }

  // tiny blur placeholder (base64) for the full-size variant
  const tiny = await sharp(buffer).rotate().resize({ width: 24 }).jpeg({ quality: 40 }).toBuffer();
  await fs.writeFile(path.join(OUT, `${job.out}.blur.txt`), `data:image/jpeg;base64,${tiny.toString("base64")}`);
}

console.log("done");
