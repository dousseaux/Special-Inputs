#!/bin/bash

# Requires:
#   npm install uglifycss -g
#   npm install uglify-js -g

# Configuration
TARGETJS=dist/djson-editor-full.js
TARGETCSS=dist/djson-editor-full.css
GIT="https://github.com/dousseaux/special_inputs"
DATE="18 July 2017"

# Make sure the target files exists and are empty
touch $TARGETJS
truncate -s 0 $TARGETJS
touch $TARGETCSS
truncate -s 0 $TARGETCSS

# Merge JS files
cat src/rangy-core.js >> $TARGETJS
cat src/rangy-selectionsaverestore.js >> $TARGETJS
cat src/djson-editor.js >> $TARGETJS

# Compress JS File
uglifyjs $TARGETJS --compress unused=false,collapse_vars=false --verbose --output $TARGETJS

# Add description to JS file
cp $TARGETJS temp
echo "/**" > $TARGETJS
echo " * This file is a minified merge of DJSON Editor, Rangy Core and Rangy Selection Save Restore" >> $TARGETJS
echo " * Author: Pedro Dousseau" >> $TARGETJS
echo " * $GIT" >> $TARGETJS
echo " * $DATE" >> $TARGETJS
echo " * Version $1" >> $TARGETJS
echo " */" >> $TARGETJS
echo " " >> $TARGETJS

# Finish JS File
cat temp >> $TARGETJS
rm temp

# Add description to CSS file
echo "/**" >> $TARGETCSS
echo " * Author: Pedro Dousseau" >> $TARGETCSS
echo " * $GIT" >> $TARGETCSS
echo " * $DATE" >> $TARGETCSS
echo " * Version $1" >> $TARGETCSS
echo " */" >> $TARGETCSS
echo " " >> $TARGETCSS
# Compress CSS
uglifycss src/djson-editor.css >> $TARGETCSS
