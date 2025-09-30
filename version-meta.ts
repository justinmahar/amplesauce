import packageJson from './package.json';
import childProcess from 'child_process';

const commitHash = childProcess.execSync('git rev-parse HEAD').toString().trim();

// Netlify sets the $BRANCH environment variable to the current branch name.
let branchName = childProcess.execSync('echo "$BRANCH"').toString().trim();
// If the branch name was not set by Netlify, retrieve it manually.
if (branchName === '') {
  branchName = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
}

const isStagingEnvironment = branchName !== 'master';
const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';
const isProductionEnvironment = process.env.NODE_ENV === 'production' && !isStagingEnvironment;
const environment = isProductionEnvironment ? 'production' : isDevelopmentEnvironment ? 'development' : 'staging';

export default {
  siteVersion: packageJson.version,
  siteBranchName: branchName,
  siteCommitHash: commitHash,
  siteEnvironment: environment,
};
