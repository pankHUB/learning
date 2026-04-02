"use client";

import { useState } from "react";

const theme = {
  bg: "#060912",
  bgCard: "#0d1117",
  bgCode: "#010409",
  border: "#1c2333",
  borderHover: "#2563eb",
  blue: "#3b82f6",
  cyan: "#38bdf8",
  green: "#4ade80",
  yellow: "#fbbf24",
  orange: "#fb923c",
  purple: "#a78bfa",
  red: "#f87171",
  textPrimary: "#e6edf3",
  textSecondary: "#8b949e",
  textMuted: "#484f58",
};

function CodeBlock({ code, lang = "bash" }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const lines = code.trim().split("\n");

  return (
    <div
      style={{
        background: theme.bgCode,
        border: `1px solid ${theme.border}`,
        borderRadius: 10,
        overflow: "hidden",
        position: "relative",
        marginTop: 12,
        marginBottom: 4,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 14px",
          borderBottom: `1px solid ${theme.border}`,
          background: "#0d1117",
        }}
      >
        <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: "monospace" }}>
          {lang}
        </span>
        <button
          onClick={copy}
          style={{
            background: copied ? "#1a3a1a" : "#161b22",
            border: `1px solid ${copied ? theme.green : theme.border}`,
            color: copied ? theme.green : theme.textSecondary,
            fontSize: 11,
            padding: "3px 10px",
            borderRadius: 5,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {/* Code */}
      <div style={{ padding: "14px 16px", overflowX: "auto" }}>
        <pre style={{ margin: 0, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13, lineHeight: 1.7 }}>
          {lines.map((line, i) => {
            const isComment = line.trimStart().startsWith("#");
            return (
              <div key={i}>
                <span style={{ color: isComment ? theme.textMuted : theme.cyan }}>
                  {line}
                </span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

function WarningBox({ title, children, type = "warn" }) {
  const colors = {
    warn: { border: theme.yellow, bg: "#1a1500", title: theme.yellow },
    error: { border: theme.red, bg: "#1a0000", title: theme.red },
    info: { border: theme.blue, bg: "#001122", title: theme.blue },
    success: { border: theme.green, bg: "#001a00", title: theme.green },
  };
  const c = colors[type];
  return (
    <div
      style={{
        border: `1px solid ${c.border}30`,
        borderLeft: `3px solid ${c.border}`,
        background: c.bg,
        borderRadius: 8,
        padding: "12px 16px",
        margin: "14px 0",
      }}
    >
      {title && (
        <p style={{ fontSize: 12, fontWeight: 700, color: c.title, marginBottom: 6, letterSpacing: "0.04em" }}>
          {title}
        </p>
      )}
      <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.6 }}>{children}</p>
    </div>
  );
}

function Step({ number, title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: theme.blue,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {number}
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary, margin: 0 }}>{title}</h3>
      </div>
      <div style={{ paddingLeft: 40 }}>{children}</div>
    </div>
  );
}

function Part({ number, title, subtitle, color = theme.blue, children }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderLeft: `4px solid ${color}`,
          borderRadius: 10,
          padding: "14px 20px",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: `${color}20`,
            border: `1px solid ${color}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 800,
            color: color,
            flexShrink: 0,
          }}
        >
          {number}
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>{title}</h2>
          <p style={{ fontSize: 12, color: theme.textMuted, margin: "2px 0 0" }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${theme.border}`, marginTop: 12 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#0d1117" }}>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  color: theme.textSecondary,
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: "0.04em",
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "transparent" : "#080d14",
                borderBottom: i < rows.length - 1 ? `1px solid ${theme.border}20` : "none",
              }}
            >
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "10px 16px", color: j === 0 ? theme.red : theme.textSecondary, verticalAlign: "top", lineHeight: 1.5 }}>
                  {typeof cell === "string" && cell.includes("`")
                    ? cell.split("`").map((part, k) =>
                        k % 2 === 1 ? (
                          <code key={k} style={{ background: "#161b22", padding: "1px 6px", borderRadius: 4, fontFamily: "monospace", fontSize: 12, color: theme.cyan }}>
                            {part}
                          </code>
                        ) : (
                          part
                        )
                      )
                    : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const glossaryTerms = [
  ["EC2", "A virtual computer (server) rented from Amazon"],
  ["Elastic IP", "A permanent IP address that does not change when you restart your server"],
  ["SSH", "A way to remotely control your server from your terminal"],
  [".pem file", "A key file that proves who you are when connecting to your server via SSH"],
  ["PM2", "A tool that keeps your app running forever and restarts it if it crashes"],
  ["Nginx", "A web server that receives traffic on port 80 and forwards it to your app on port 3000"],
  ["GitHub Actions", "A tool that automatically runs tasks (like deploying) when you push code"],
  ["NVM", "Node Version Manager — lets you install and switch between Node.js versions"],
  ["Swap memory", "Extra virtual memory using disk space — prevents crashes on small servers"],
];

const troubleshootingRows = [
  ["`Killed` during npm install", "Out of memory", "Step 4: add swap, then rm -rf node_modules && npm install"],
  ["`ENOTEMPTY` rename error", "Corrupted node_modules from OOM", "rm -rf node_modules && npm install"],
  ["`next: not found`", "NVM not loaded in shell", "Run: export NVM_DIR=\"$HOME/.nvm\" && source \"$NVM_DIR/nvm.sh\""],
  ["PM2 status: errored", "App crashing on startup", "pm2 logs nextjs-app --lines 50 to see why"],
  ["`curl` port 3000 refused", "App is not running", "Check: pm2 status — restart if needed"],
  ["Nginx 502 Bad Gateway", "App not on port 3000", "pm2 status + curl localhost:3000"],
  ["SSH: Permission denied (publickey)", "Wrong key or not in authorized_keys", "Redo Step 13 — check cat ~/.ssh/authorized_keys on server"],
  ["Handshake failed in GitHub Actions", "Wrong key in EC2_SSH_KEY secret", "cat ~/.ssh/gh_deploy on local, paste full private key into secret"],
  ["cd: Permission denied in Actions", "Wrong EC2_USER secret", "Set EC2_USER = deployer (not ubuntu)"],
  ["not a git repository", "cd failed silently above", "Fix the permission/path error that caused cd to fail"],
];

const cicdTimeline = [
  ["0 sec", "You run: git push origin main"],
  ["~5 sec", "GitHub Actions runner starts"],
  ["~30 sec", "npm ci installs dependencies on the runner"],
  ["~60 sec", "npm run lint checks your code"],
  ["~90 sec", "npm run build compiles Next.js on the runner"],
  ["~2 min", "SSH connection opens to your EC2 server"],
  ["~2.5 min", "git pull downloads your latest code to the server"],
  ["~3 min", "npm ci installs on the server"],
  ["~4 min", "npm run build compiles on the server"],
  ["~4.5 min", "pm2 reload restarts your app gracefully"],
  ["~4.5 min", "Your new version is live at your IP address"],
];

export default function NextJSDeploymentPage() {
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.textPrimary, fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${theme.bg}; }
        ::-webkit-scrollbar-thumb { background: #1c2333; border-radius: 3px; }
      `}</style>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, fontSize: 13, color: theme.textMuted }}>
          <a href="/learning" style={{ color: theme.textMuted, textDecoration: "none" }}>Learning Hub</a>
          <span>›</span>
          <span style={{ color: theme.textSecondary }}>Next.js Deployment</span>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 40 }}>🚀</span>
            <div>
              <div style={{ fontSize: 11, color: theme.blue, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                Deployment Guide
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: theme.textPrimary, margin: 0, lineHeight: 1.2 }}>
                Deploy Next.js on AWS EC2
              </h1>
            </div>
          </div>
          <p style={{ fontSize: 15, color: theme.textSecondary, lineHeight: 1.7, maxWidth: 620, marginLeft: 52 }}>
            A complete step-by-step guide to get your Next.js app live on the internet, with automatic CI/CD so every push to GitHub deploys automatically.
          </p>

          {/* Part pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20, marginLeft: 52 }}>
            {["EC2 Setup", "Server Setup", "App Deploy", "Auto CI/CD"].map((p, i) => (
              <span
                key={p}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: theme.blue,
                  background: `${theme.blue}15`,
                  border: `1px solid ${theme.blue}30`,
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                Part {i + 1}: {p}
              </span>
            ))}
          </div>
        </div>

        {/* Before You Start */}
        <div
          style={{
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 36,
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 700, color: theme.textPrimary, marginBottom: 12 }}>Before You Start</h2>
          <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>
            Read this section completely before touching anything. It will save you hours.
          </p>
          <WarningBox title="What you need" type="info">
            An AWS account, a GitHub account with your Next.js repo, and a computer with a terminal (Mac/Linux) or WSL on Windows.
          </WarningBox>
          <WarningBox title="Common beginner mistakes that will waste hours" type="error">
            1) Copying the public key into GitHub instead of the private key. &nbsp;
            2) Skipping the swap memory step on t2.micro. &nbsp;
            3) Using the ubuntu user instead of deployer. &nbsp;
            4) Not running npm install before npm run build. &nbsp;
            5) Wrong folder path in the workflow file.
          </WarningBox>

          {/* Glossary toggle */}
          <button
            onClick={() => setGlossaryOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              border: `1px solid ${theme.border}`,
              color: theme.textSecondary,
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 13,
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            <span>{glossaryOpen ? "▾" : "▸"}</span>
            Glossary — terms used in this guide
          </button>

          {glossaryOpen && (
            <div style={{ marginTop: 12 }}>
              <Table
                headers={["Term", "What it means"]}
                rows={glossaryTerms.map(([t, d]) => [t, d])}
              />
            </div>
          )}
        </div>

        {/* Part 1 */}
        <Part number="1" title="Create your EC2 server on AWS" subtitle="Takes about 10 minutes. You only do this once." color={theme.blue}>

          <Step number="1" title="Launch an EC2 instance">
            <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 10, lineHeight: 1.6 }}>
              Log into your AWS account and follow these steps exactly:
            </p>
            <ol style={{ paddingLeft: 20, margin: 0 }}>
              {[
                "Go to AWS Console → search EC2 → click EC2",
                "Click the orange Launch Instance button",
                <>Fill in the form: Name: <code style={{ background: "#161b22", padding: "1px 6px", borderRadius: 4, fontFamily: "monospace", fontSize: 12, color: theme.cyan }}>my-nextjs-server</code>, AMI: Ubuntu Server 22.04 LTS, Instance type: <code style={{ background: "#161b22", padding: "1px 6px", borderRadius: 4, fontFamily: "monospace", fontSize: 12, color: theme.cyan }}>t2.micro</code></>,
                <>Key pair: click <strong>Create new key pair</strong> → name it <code style={{ background: "#161b22", padding: "1px 6px", borderRadius: 4, fontFamily: "monospace", fontSize: 12, color: theme.cyan }}>nextjs-key</code> → RSA → .pem format → click Create</>,
                "Scroll to Network settings → click Edit → Add rules for SSH (22), HTTP (80), HTTPS (443)",
                "Click Launch Instance → wait 1–2 minutes for Running status",
              ].map((item, i) => (
                <li key={i} style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.7, marginBottom: 4 }}>{item}</li>
              ))}
            </ol>
            <WarningBox title="Do not lose your .pem file" type="warn">
              It was downloaded to your computer when you created the key pair. Move it somewhere safe like ~/Downloads/. If you lose it you cannot SSH into your server and will have to start over.
            </WarningBox>
          </Step>

          <Step number="2" title="Get a permanent IP address (Elastic IP)">
            <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 10, lineHeight: 1.6 }}>
              By default your server IP changes every time you restart it. Fix this now:
            </p>
            <ol style={{ paddingLeft: 20, margin: 0 }}>
              {[
                "In EC2 console → left sidebar → Network & Security → Elastic IPs",
                "Click Allocate Elastic IP address → click Allocate",
                "Select the new IP → click Actions → Associate Elastic IP address",
                "Choose your instance from the dropdown → click Associate",
                "Write down this IP address — you will use it throughout this guide",
              ].map((item, i) => (
                <li key={i} style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.7, marginBottom: 4 }}>{item}</li>
              ))}
            </ol>
            <WarningBox title="Your Elastic IP" type="info">
              Write it down (e.g. 3.21.30.110). You will replace YOUR_ELASTIC_IP with this value in every command below.
            </WarningBox>
          </Step>

          <Step number="3" title="Connect to your server for the first time">
            <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 4, lineHeight: 1.6 }}>
              Open your terminal and run:
            </p>
            <CodeBlock code={`# Fix permissions on your key file (required by SSH)
chmod 400 ~/Downloads/nextjs-key.pem

# Connect to your server (replace with your Elastic IP)
ssh -i ~/Downloads/nextjs-key.pem ubuntu@YOUR_ELASTIC_IP`} />
            <WarningBox title="You are connected" type="success">
              You should see a welcome message and your prompt will change to ubuntu@ip-xxx. You are now inside your server.
            </WarningBox>
          </Step>

        </Part>

        {/* Part 2 */}
        <Part number="2" title="Set up the server software" subtitle="Run these commands inside your server. Takes about 5 minutes." color={theme.cyan}>

          <Step number="4" title="Add swap memory (CRITICAL on t2.micro)">
            <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 4, lineHeight: 1.6 }}>
              t2.micro only has 1 GB of RAM. Without swap, npm install will be killed mid-way with no clear error message. Always do this first.
            </p>
            <CodeBlock code={`sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make it survive server restarts
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify it worked — you should see Swap: 2.0Gi
free -h`} />
            <WarningBox title="If you skip this step" type="error">
              npm install will be killed halfway through with just the word 'Killed' in the terminal. You will see a corrupted node_modules folder and errors like ENOTEMPTY. Always set up swap before installing anything.
            </WarningBox>
          </Step>

          <Step number="5" title="Install Node.js, PM2, Nginx and Git">
            <CodeBlock code={`# Update the package list
sudo apt update && sudo apt upgrade -y

# Install Node.js via NVM (recommended way)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Verify Node is installed
node -v   # should print v20.x.x
npm -v    # should print a version number

# Install PM2 (keeps your app running)
npm install -g pm2

# Install Nginx (web server) and Git
sudo apt install nginx git -y
sudo systemctl enable nginx
sudo systemctl start nginx`} />
          </Step>

          <Step number="6" title="Create a dedicated deployer user">
            <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 4, lineHeight: 1.6 }}>
              Never run your app as the ubuntu user. Create a deployer user instead — this is a security best practice.
            </p>
            <CodeBlock code={`# Create the deployer user
sudo adduser deployer
# Press Enter to skip all questions, type Y at the end
sudo usermod -aG sudo deployer

# Switch to the deployer user
su - deployer

# Install NVM again for this user
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
npm install -g pm2

# Confirm you are now the deployer user
whoami   # should print: deployer`} />
            <WarningBox title="Stay as deployer for the rest of Part 2 and Part 3" type="warn">
              All commands from here until Part 4 should be run as the deployer user. Your terminal prompt will show deployer@ip-xxx.
            </WarningBox>
          </Step>

        </Part>

        {/* Part 3 */}
        <Part number="3" title="Deploy your Next.js app" subtitle="Clone, configure, build and start your app." color={theme.green}>

          <Step number="7" title="Clone your repository">
            <CodeBlock code={`# Make sure you are the deployer user (run: whoami)
cd /home/deployer

# Clone your repo (replace with your actual GitHub URL)
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git learning
cd learning
ls   # you should see your project files here`} />
            <WarningBox title="Folder name" type="info">
              We name the folder 'learning' here. Remember this name — you will use it in several places throughout this guide.
            </WarningBox>
          </Step>

          <Step number="8" title="Set up environment variables">
            <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 4, lineHeight: 1.6 }}>
              Store env vars outside the repo so git pull never overwrites them.
            </p>
            <CodeBlock code={`# Create your env file (outside the repo folder)
nano /home/deployer/.env.production

# Add your variables, one per line, for example:
# NEXT_PUBLIC_API_URL=https://api.example.com
# DATABASE_URL=postgresql://user:pass@host/db

# Save: press Ctrl+X then Y then Enter

# Link it into your project
ln -s /home/deployer/.env.production /home/deployer/learning/.env.production`} />
            <WarningBox title="Why symlink?" type="info">
              The symlink means your .env file lives at /home/deployer/.env.production but your app sees it inside the project folder. When git pull updates your code it never touches the .env file.
            </WarningBox>
          </Step>

          <Step number="9" title="Install dependencies and build">
            <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 4, lineHeight: 1.6 }}>
              This is the step where most beginners hit problems. Follow it exactly.
            </p>
            <CodeBlock code={`cd /home/deployer/learning

# IMPORTANT: load NVM before running any npm commands
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"

# Check node and npm are available
node -v   # must print a version — if not, NVM is not loaded
npm -v    # must print a version

# Install all dependencies
npm install

# Verify the next binary exists before building
ls node_modules/.bin/next   # must print a path

# Build the app
npm run build

# Confirm the build folder was created
ls .next   # must exist`} />
            <WarningBox title="If npm install shows 'Killed'" type="error">
              Your server ran out of memory. Go back to Step 4 and set up swap memory first. Then run: rm -rf node_modules && npm install
            </WarningBox>
            <WarningBox title="If npm run build shows 'next: not found'" type="error">
              NVM is not loaded. Run this line first, then try again: export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
            </WarningBox>
          </Step>

          <Step number="10" title="Start your app with PM2">
            <CodeBlock code={`# Start the app
pm2 start npm --name "nextjs-app" -- start

# Save so PM2 restarts your app after a server reboot
pm2 save

# Set PM2 to auto-start on boot (run the command it prints)
pm2 startup
# It will print a command starting with 'sudo env PATH=...'
# Copy that command and run it

# Check your app is running
pm2 status   # status column should say: online

# Test the app is responding
curl http://localhost:3000   # should return HTML`} />
            <WarningBox title="If PM2 status shows 'errored'" type="error">
              Check the logs: pm2 logs nextjs-app --lines 50. Most common causes: 'next: not found' means NVM was not loaded — delete the PM2 process, source NVM, then start again. 'Cannot find module' means npm install did not finish.
            </WarningBox>
          </Step>

          <Step number="11" title="Configure Nginx">
            <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 4, lineHeight: 1.6 }}>
              Nginx receives traffic on port 80 and forwards it to your app on port 3000.
            </p>
            <CodeBlock code={`# Create the Nginx config file
sudo nano /etc/nginx/sites-available/nextjs`} />
            <p style={{ fontSize: 13, color: theme.textSecondary, margin: "12px 0 4px", lineHeight: 1.6 }}>
              Paste this exactly into the file (replace YOUR_ELASTIC_IP):
            </p>
            <CodeBlock lang="nginx" code={`server {
    listen 80;
    server_name YOUR_ELASTIC_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}`} />
            <CodeBlock code={`# Enable the config
sudo ln -s /etc/nginx/sites-available/nextjs /etc/nginx/sites-enabled/

# Remove the default page
sudo rm /etc/nginx/sites-enabled/default

# Test the config — must print 'syntax is ok'
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx`} />
            <WarningBox title="Test it in your browser" type="success">
              Open http://YOUR_ELASTIC_IP in your browser. Your Next.js app should appear. If you see the Nginx default page, run sudo nginx -t and check for errors.
            </WarningBox>
          </Step>

        </Part>

        {/* Part 4 */}
        <Part number="4" title="Set up automatic deployment (CI/CD)" subtitle="Every git push to main will deploy automatically after this." color={theme.purple}>

          <WarningBox title="Run Steps 12–13 on your LOCAL machine" type="warn">
            Open a new terminal window on your own computer — not on the server.
          </WarningBox>

          <Step number="12" title="Create an SSH key pair for GitHub">
            <CodeBlock code={`# Run on YOUR LOCAL MACHINE — not on the server
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/gh_deploy
# Press Enter twice when asked for a passphrase (leave it empty)

# This creates two files:
# ~/.ssh/gh_deploy      ← PRIVATE KEY — goes into GitHub
# ~/.ssh/gh_deploy.pub  ← PUBLIC KEY  — goes onto your server`} />
            <WarningBox title="Private vs Public key — the most common mistake" type="error">
              The PRIVATE key (gh_deploy, no .pub) goes into GitHub secrets. The PUBLIC key (gh_deploy.pub) goes onto the server. Getting these backwards is the #1 cause of 'handshake failed' errors.
            </WarningBox>
          </Step>

          <Step number="13" title="Add the public key to your server">
            <CodeBlock code={`# On your LOCAL machine — get the public key content
cat ~/.ssh/gh_deploy.pub
# Copy the entire output

# Now SSH into your server with your .pem key
ssh -i ~/Downloads/nextjs-key.pem ubuntu@YOUR_ELASTIC_IP

# Switch to deployer
sudo su - deployer

# Add the public key
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the public key content here
# Save: Ctrl+X then Y then Enter

chmod 600 ~/.ssh/authorized_keys`} />
            <p style={{ fontSize: 13, color: theme.textSecondary, margin: "12px 0 4px", lineHeight: 1.6 }}>
              Test it works from your local machine:
            </p>
            <CodeBlock code={`# Run on your LOCAL machine
ssh -i ~/.ssh/gh_deploy deployer@YOUR_ELASTIC_IP
# You should connect without being asked for a password
# If this works, GitHub Actions will work too
# Type 'exit' to disconnect`} />
            <WarningBox title="If SSH says 'Permission denied (publickey)'" type="error">
              The public key was not saved correctly in authorized_keys. SSH back in with your .pem key, switch to deployer, and check: cat ~/.ssh/authorized_keys — it should show the key you pasted.
            </WarningBox>
          </Step>

          <Step number="14" title="Add secrets to GitHub">
            <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 12, lineHeight: 1.6 }}>
              Go to your GitHub repo → Settings → Secrets and variables → Actions → New repository secret. Add these three:
            </p>
            <Table
              headers={["Secret name", "Value to paste"]}
              rows={[
                ["EC2_HOST", "Your Elastic IP (e.g. 3.21.30.110)"],
                ["EC2_USER", "deployer"],
                ["EC2_SSH_KEY", "Run: cat ~/.ssh/gh_deploy on your local machine and paste the entire output including header and footer lines"],
              ]}
            />
            <WarningBox title="EC2_SSH_KEY must include the full private key" type="warn">
              The value must start with -----BEGIN OPENSSH PRIVATE KEY----- and end with -----END OPENSSH PRIVATE KEY-----. If you paste only the middle part it will fail.
            </WarningBox>
          </Step>

          <Step number="15" title="Create the GitHub Actions workflow file">
            <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 4, lineHeight: 1.6 }}>
              On your LOCAL machine, inside your project folder:
            </p>
            <CodeBlock code={`mkdir -p .github/workflows
nano .github/workflows/deploy.yml`} />
            <p style={{ fontSize: 13, color: theme.textSecondary, margin: "12px 0 4px", lineHeight: 1.6 }}>
              Paste this exactly:
            </p>
            <CodeBlock lang="yaml" code={`name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  ci:
    name: Build and Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Build
        run: npm run build

  deploy:
    name: Deploy to EC2
    runs-on: ubuntu-latest
    needs: ci
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: \${{ secrets.EC2_HOST }}
          username: \${{ secrets.EC2_USER }}
          key: \${{ secrets.EC2_SSH_KEY }}
          script: |
            export NVM_DIR="$HOME/.nvm"
            source "$NVM_DIR/nvm.sh"
            cd /home/deployer/learning
            git pull origin main
            npm ci
            npm run build
            pm2 describe nextjs-app > /dev/null 2>&1 \\
              && pm2 reload nextjs-app \\
              || pm2 start npm --name "nextjs-app" -- start
            pm2 save
            echo "Deployment complete"`} />
            <p style={{ fontSize: 13, color: theme.textSecondary, margin: "12px 0 4px", lineHeight: 1.6 }}>
              Commit and push to trigger your first deployment:
            </p>
            <CodeBlock code={`git add .github/workflows/deploy.yml
git commit -m "add CI/CD pipeline"
git push origin main`} />
            <WarningBox title="Watch it run" type="success">
              Go to your GitHub repo → click the Actions tab → click the running workflow. You will see each step running in real time.
            </WarningBox>
          </Step>

        </Part>

        {/* CI/CD Timeline */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.textPrimary, marginBottom: 16 }}>
            What Happens Every Time You Push Code
          </h2>
          <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 14, lineHeight: 1.6 }}>
            Once everything is set up, this is the automated flow triggered by every git push to main:
          </p>
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, overflow: "hidden" }}>
            {cicdTimeline.map(([time, event], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: "11px 16px",
                  background: i % 2 === 0 ? "transparent" : "#080d14",
                  borderBottom: i < cicdTimeline.length - 1 ? `1px solid ${theme.border}20` : "none",
                }}
              >
                <span style={{ fontSize: 12, fontFamily: "monospace", color: theme.purple, minWidth: 60, paddingTop: 1 }}>{time}</span>
                <span style={{ fontSize: 13, color: theme.textSecondary }}>{event}</span>
              </div>
            ))}
          </div>
          <WarningBox title="If the lint or build step fails" type="info">
            The deploy step will not run. Your live site stays on the previous working version. Fix the error, push again.
          </WarningBox>
        </section>

        {/* Troubleshooting */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.textPrimary, marginBottom: 8 }}>
            Troubleshooting — Common Problems
          </h2>
          <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 14, lineHeight: 1.6 }}>
            If something goes wrong, find your error below and follow the fix.
          </p>
          <Table
            headers={["Error", "Cause", "Fix"]}
            rows={troubleshootingRows}
          />
        </section>

        {/* Useful Commands */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.textPrimary, marginBottom: 14 }}>
            Useful Commands
          </h2>
          <CodeBlock code={`# Check if your app is running
pm2 status

# See live app logs
pm2 logs nextjs-app --lines 50

# Watch app status update every second
watch -n 1 pm2 status

# See live Nginx errors
sudo tail -f /var/log/nginx/error.log

# Check what is running on port 3000
sudo lsof -i :3000

# Check memory (swap should show 2.0Gi)
free -h

# Restart app (graceful, zero downtime)
pm2 reload nextjs-app

# Restart Nginx
sudo systemctl restart nginx`} />
        </section>

        {/* Footer nav */}
        <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 24 }}>
          <a
            href="/learning"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: theme.textSecondary,
              textDecoration: "none",
            }}
          >
            ← Back to Learning Hub
          </a>
        </div>

      </div>
    </div>
  );
}
