#!/bin/bash

# Load the correct PATH so git is found by launchd
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

# Navigate to the project
cd /Users/angelamanzano/Documents/Solace/solace-engine

# Check if there is anything to commit
if [[ -n $(git status --porcelain) ]]; then
  git add .
  git commit -m "Auto backup — $(date '+%Y-%m-%d %H:%M')"
  git push origin main
  echo "$(date): Backup completed" >> /Users/angelamanzano/Documents/Solace/solace-engine/backup.log
else
  echo "$(date): No changes to back up" >> /Users/angelamanzano/Documents/Solace/solace-engine/backup.log
fi
