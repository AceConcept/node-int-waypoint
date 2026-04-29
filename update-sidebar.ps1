param(
  [string]$CommitMessage = "Bump waypoint-sidebar",
  [switch]$Push
)

$ErrorActionPreference = "Stop"

Write-Host "Updating waypoint-sidebar dependency to latest main..." -ForegroundColor Cyan
npm install "waypoint-sidebar@git+https://github.com/AceConcept/waypoint-sidebar.git#main"

Write-Host "Staging package lockfile..." -ForegroundColor Cyan
git add package.json package-lock.json

$hasChanges = git diff --cached --name-only
if (-not $hasChanges) {
  Write-Host "No dependency changes. Nothing to commit." -ForegroundColor Yellow
  exit 0
}

Write-Host "Creating commit: $CommitMessage" -ForegroundColor Cyan
git commit -m "$CommitMessage"

if ($Push) {
  Write-Host "Pushing current branch..." -ForegroundColor Cyan
  git push
} else {
  Write-Host "Done. Run 'git push' when you are ready." -ForegroundColor Green
}
