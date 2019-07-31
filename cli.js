#!/usr/bin/env node

const thumbsupply = require(".");

function processArgs(argv) {
  let forceCreate = false;
  let timestamp = "10%";
  let filename = null;
  let cacheDebug = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--forceCreate") {
      forceCreate = true;
    } else if (arg === "--timestamp") {
      timestamp = argv[i + 1];
      i++;
    } else if (arg === "--cacheDebug") {
      cacheDebug = true;
    } else {
      filename = arg;
    }
  }
  return { filename, timestamp, forceCreate, cacheDebug };
}

async function doesThumbnailExist(file) {
  try {
    await thumbsupply.lookupThumbnail(file);
    return true;
  } catch (e) {
    return false;
  }
}

async function main() {
  const args = processArgs(process.argv.slice(2));
  if (args.cacheDebug) {
    const thumbnailCached = await doesThumbnailExist(args.filename);
    console.error(
      thumbnailCached
        ? "Thumbnail is already cached"
        : "Thumbnail is NOT already cached"
    );
  }
  const thumbnail = await thumbsupply.generateThumbnail(args.filename, {
    forceCreate: args.forceCreate,
    timestamp: args.timestamp
  });
  console.log(thumbnail);
}

main().catch(console.error);
