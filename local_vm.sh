#!/usr/bin/env bash
sed -i -e 's_http://localhost:5000/_http://172.16.101.244:5000/_g'  $(find ./frontend/src/views/ -type f)
