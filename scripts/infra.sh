#!/bin/bash

gcloud projects create nextux-dev
gcloud config set project nextux-dev
gcloud services enable speech.googleapis.com
gcloud iam service-accounts create nextux-dev-service-account --display-name "nextux-dev service account"
gcloud iam service-accounts keys create ./key.json --iam-account nextux-dev-service-account@nextux-dev.iam.gserviceaccount.com
gcloud projects add-iam-policy-binding nextux-dev \
  --member="serviceAccount:nextux-dev-service-account@nextux-dev.iam.gserviceaccount.com" \
  --role="roles/ml.admin"
