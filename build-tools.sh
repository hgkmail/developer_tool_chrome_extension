#!/bin/bash

cd ak_tools
npm run build
cd ../pages
rm -rf tab
cp -r ../ak_tools/dist tab
