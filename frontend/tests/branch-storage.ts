import path from 'path';

/**
 * Sanitize the branch name so it can safely be used in a filename.
 * Replaces any character that is not a-z, A-Z, 0-9, -, or _ with a hyphen (-).
 * Also truncates overly long names (just in case).
 */
function sanitizeBranchName(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, '-').substring(0, 100);
}

/**
 * Determine branch name for per-branch auth storage.
 */
const rawBranchName = process.env.BRANCH_NAME || 'local';
export const branchName = sanitizeBranchName(rawBranchName);

/**
 * Compute full path for the branch-specific storage file.
 */
export const storageFile = path.resolve(`auth-${branchName}.json`);
