// frontend/tests/branch-storage.ts
import path from 'path';

/**
 * Determine branch name for per-branch auth storage
 * Priority:
 * 1. BRANCH_NAME env var (set in GitHub Actions)
 * 2. Fallback to 'local'
 */
export const branchName = process.env.BRANCH_NAME || 'local';

/**
 * Full path for storage file
 */
export const storageFile = path.resolve(`auth-${branchName}.json`);
