📦 How to use in a workflow:
# Deploy Monitoring Stack
```
name: Deploy Monitoring Stack

on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy Grafana and Prometheus
        uses: ./github/actions/deploy-monitoring
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: "us-east-1"
          kubeconfig: ${{ secrets.KUBECONFIG }}
```


