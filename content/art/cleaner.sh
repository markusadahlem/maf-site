#!/bin/bash

INPUT_HTML="$1"
OUTPUT_MD="${INPUT_HTML%.html}.md"



TMP_HTML=$(mktemp)
awk '/<!-- BO bodyContent_Headline -->/ {found=1; next} found' "$INPUT_HTML" > "$TMP_HTML"


#mv "$TMP_HTML" "$OUTPUT_MD"
pandoc --from=html --to=gfm --markdown-headings=atx "$TMP_HTML" >> "$OUTPUT_MD"

echo "✅ Converted: $INPUT_HTML → $OUTPUT_MD"
