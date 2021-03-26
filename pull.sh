#!/usr/bin/env bash
./vm_local.sh
git pull origin main
./local_vm.sh
cd backend
flask run --host=0.0.0.0 --port=5000