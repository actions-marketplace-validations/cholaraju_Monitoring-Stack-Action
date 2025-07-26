const core = require('@actions/core');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const accessKeyId = core.getInput('aws-access-key-id');
    const secretAccessKey = core.getInput('aws-secret-access-key');
    const region = core.getInput('aws-region');
    const kubeconfig = core.getInput('kubeconfig');

    // Set AWS credentials
    core.exportVariable('AWS_ACCESS_KEY_ID', accessKeyId);
    core.exportVariable('AWS_SECRET_ACCESS_KEY', secretAccessKey);
    core.exportVariable('AWS_DEFAULT_REGION', region);

    // Write kubeconfig to file
    const kubeconfigPath = path.join(process.env.HOME, '.kube', 'config');
    fs.mkdirSync(path.dirname(kubeconfigPath), { recursive: true });
    fs.writeFileSync(kubeconfigPath, kubeconfig);
    console.log('✅ Kubeconfig written');

    // Add Helm repos
    execSync('helm repo add prometheus-community https://prometheus-community.github.io/helm-charts', { stdio: 'inherit' });
    execSync('helm repo add grafana https://grafana.github.io/helm-charts', { stdio: 'inherit' });
    execSync('helm repo update', { stdio: 'inherit' });

    // Install Prometheus
    execSync('helm upgrade --install prometheus prometheus-community/prometheus --namespace monitoring --create-namespace', { stdio: 'inherit' });

    // Install Grafana
    execSync('helm upgrade --install grafana grafana/grafana --namespace monitoring', { stdio: 'inherit' });

    console.log('🎉 Grafana and Prometheus deployed successfully!');
  } catch (error) {
    core.setFailed(`🚨 Deployment failed: ${error.message}`);
  }
}

run();
