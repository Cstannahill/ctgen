# release-helper.ps1
Write-Host "--- ctgen Release Helper ---" -ForegroundColor Cyan

# Show current published NPM version
Write-Host "Current published NPM version:" -ForegroundColor Yellow
npm view ctgen version

# Show current git tag
Write-Host "Current git tags:" -ForegroundColor Yellow
git tag

Write-Host "`nStep 1: git add ."
Read-Host "Press Enter to run 'git add .' or Ctrl+C to cancel"
git add .

Write-Host "`nStep 2: git commit"
$commitMsg = Read-Host "Enter commit message"
git commit -m "$commitMsg"

Write-Host "`nStep 3: git tag"
$tag = Read-Host "Enter new tag (e.g., v1.0.1) or leave blank to skip tagging"
if ($tag -ne "") {
  git tag $tag
  git push origin $tag
}

Write-Host "`nStep 4: git push"
git push

Write-Host "`nStep 5: npm publish"
Read-Host "Press Enter to run 'npm publish' or Ctrl+C to skip"
npm publish

Write-Host "`nAll done!" -ForegroundColor Green
