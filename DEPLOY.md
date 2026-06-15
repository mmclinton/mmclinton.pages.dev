# Deploying

Source on Codeberg, built with Nix, deployed to **Cloudflare Pages** via Direct Upload
(`wrangler`). Push to `main` → a self-hosted Forgejo runner builds and deploys.

## One-time setup

### 1. Cloudflare

- Create an **API token**: Cloudflare dashboard → My Profile → API Tokens → Create Token →
  permission **Account › Cloudflare Pages › Edit**. Save the token.
- Note your **Account ID** (Workers & Pages → right sidebar).
- Create the project. The name becomes `<name>.pages.dev` and must be globally unique;
  `mmc` was taken, so the project is **`mmc-6wo`** (→ `mmc-6wo.pages.dev`). If you ever
  change the project name, update `base_url` in `config.toml` + `--project-name` in
  `scripts/deploy.sh` and `.forgejo/workflows/deploy.yml` to match.

  ```fish
  nix develop --command npx -y wrangler pages project create mmc-6wo --production-branch main
  ```

### 2. First (bootstrap) deploy — validate it live

```fish
nix develop --command npx -y wrangler login   # or: set -x CLOUDFLARE_API_TOKEN …; set -x CLOUDFLARE_ACCOUNT_ID …
nix develop --command ./scripts/deploy.sh
```

→ live at `https://mmc-6wo.pages.dev`.

### 3. Codeberg repo + push

```fish
git remote add origin https://codeberg.org/<you>/website.git
git push -u origin main
```

### 4. Enable CI (push-to-deploy)

- Repo → Settings → **Units** → enable **Actions**.
- Repo → Settings → Actions → **Runners** → _Create new Runner_; register a
  [self-hosted Forgejo runner](https://forgejo.org/docs/latest/admin/actions/runner-installation/)
  with the label `self-hosted`. Run it on a machine with Nix for fast builds (a warm Nix
  store across runs); if the host already has Nix, you can drop the `nix-installer-action`
  step from the workflow.
- Repo → Settings → Actions → **Secrets** → add `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID`.

After that, every `git push` to `main` deploys via `.forgejo/workflows/deploy.yml`.

## Custom domain (later)

Add the domain to the Pages project in the Cloudflare dashboard, set `base_url` in
`config.toml` to it, then redeploy.
