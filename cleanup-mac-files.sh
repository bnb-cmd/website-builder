#!/bin/bash

# Clean Mac OS X Resource Fork Files
# This script removes all Mac OS X resource fork files and .DS_Store files

echo "🧹 Cleaning Mac OS X resource fork files..."

# Count files before deletion
RESOURCE_FORK_COUNT=$(find . -name "._*" -type f | wc -l)
DS_STORE_COUNT=$(find . -name ".DS_Store" -type f | wc -l)

echo "Found $RESOURCE_FORK_COUNT resource fork files (._*)"
echo "Found $DS_STORE_COUNT .DS_Store files"

if [ $RESOURCE_FORK_COUNT -gt 0 ] || [ $DS_STORE_COUNT -gt 0 ]; then
    # Delete resource fork files
    find . -name "._*" -type f -delete
    find . -name ".DS_Store" -type f -delete
    
    echo "✅ Cleaned up Mac OS X files"
else
    echo "✅ No Mac OS X files found"
fi

echo "🎉 Cleanup complete!"
