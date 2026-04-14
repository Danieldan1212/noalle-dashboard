#!/bin/bash
# ============================================
# Claude Code Setup for Noalle Jewelry
# Run this on his Windows PC (Git Bash or WSL)
# ============================================

echo "🔧 Setting up Claude Code for Noalle Jewelry..."
echo ""

# Detect home directory
CLAUDE_HOME="$HOME/.claude"

# Create directory structure
echo "📁 Creating directories..."
mkdir -p "$CLAUDE_HOME/skills"
mkdir -p "$CLAUDE_HOME/agents"
mkdir -p "$CLAUDE_HOME/rules/common"

# Get the directory where this script lives
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Copy skills
echo "📦 Copying skills..."
for skill in brand design banner-design content-engine slides article-writing market-research investor-outreach investor-materials fal-ai-media; do
  if [ -d "$SCRIPT_DIR/skills/$skill" ]; then
    cp -r "$SCRIPT_DIR/skills/$skill" "$CLAUDE_HOME/skills/"
    echo "  ✅ $skill"
  else
    echo "  ⚠️  $skill not found, skipping"
  fi
done

# Copy custom skills (from daniel/skills/)
echo ""
echo "📦 Copying custom Noalle skills..."
CUSTOM_SKILLS_DIR="$(dirname "$SCRIPT_DIR")/skills"
for skill in noalle-post noalle-analytics fix-hebrew study-buddy; do
  if [ -d "$CUSTOM_SKILLS_DIR/$skill" ]; then
    cp -r "$CUSTOM_SKILLS_DIR/$skill" "$CLAUDE_HOME/skills/"
    echo "  ✅ $skill"
  else
    echo "  ⚠️  $skill not found, skipping"
  fi
done

# Copy agents
echo ""
echo "🤖 Copying agents..."
for agent in chief-of-staff.md loop-operator.md planner.md security-reviewer.md; do
  if [ -f "$SCRIPT_DIR/agents/$agent" ]; then
    cp "$SCRIPT_DIR/agents/$agent" "$CLAUDE_HOME/agents/"
    echo "  ✅ $agent"
  else
    echo "  ⚠️  $agent not found, skipping"
  fi
done

# Copy rules
echo ""
echo "📋 Copying rules..."
for rule in performance.md hooks.md agents.md security.md ui-design.md; do
  if [ -f "$SCRIPT_DIR/rules/common/$rule" ]; then
    cp "$SCRIPT_DIR/rules/common/$rule" "$CLAUDE_HOME/rules/common/"
    echo "  ✅ $rule"
  else
    echo "  ⚠️  $rule not found, skipping"
  fi
done

# Copy settings
echo ""
echo "⚙️  Copying settings..."
if [ -f "$SCRIPT_DIR/settings.json" ]; then
  if [ ! -f "$CLAUDE_HOME/settings.json" ]; then
    cp "$SCRIPT_DIR/settings.json" "$CLAUDE_HOME/settings.json"
    echo "  ✅ settings.json"
  else
    echo "  ⚠️  settings.json already exists, skipping (won't overwrite)"
  fi
fi

# Install Serena (semantic code intelligence)
echo ""
echo "🧠 Setting up Serena..."
mkdir -p "$HOME/.serena"
if [ -f "$SCRIPT_DIR/serena/serena_config.yml" ]; then
  cp "$SCRIPT_DIR/serena/serena_config.yml" "$HOME/.serena/serena_config.yml"
  echo "  ✅ Serena config"
fi

# Check if uv is available for Serena install
if command -v uv &> /dev/null; then
  echo "  📥 Installing Serena via uv..."
  uv tool install -p 3.13 serena-agent@latest --prerelease=allow 2>/dev/null
  echo "  ✅ Serena installed"
elif command -v pip &> /dev/null; then
  echo "  📥 Installing Serena via pip..."
  pip install serena-agent 2>/dev/null
  echo "  ✅ Serena installed"
else
  echo "  ⚠️  Neither uv nor pip found. Install Serena manually:"
  echo "     pip install serena-agent"
fi

# Set up Knowledge Graph vault
echo ""
echo "📚 Setting up Knowledge Graph..."
mkdir -p "$CLAUDE_HOME/kg-global/projects"
mkdir -p "$CLAUDE_HOME/kg-global/patterns"
mkdir -p "$CLAUDE_HOME/kg-global/decisions"
if [ -d "$SCRIPT_DIR/kg-vault" ]; then
  cp -r "$SCRIPT_DIR/kg-vault/"* "$CLAUDE_HOME/kg-global/" 2>/dev/null
  echo "  ✅ Knowledge Graph vault with project stubs + decisions"
fi

# Copy MCP server configs
echo ""
echo "🔌 Setting up MCP servers..."
mkdir -p "$CLAUDE_HOME/mcp-configs"
if [ -f "$SCRIPT_DIR/mcp-configs/mcp-servers.json" ]; then
  cp "$SCRIPT_DIR/mcp-configs/mcp-servers.json" "$CLAUDE_HOME/mcp-configs/"
  echo "  ✅ MCP configs (Serena + Context7 + fal.ai)"
  echo "  ⚠️  Remember to update FAL_KEY in mcp-servers.json"
fi

echo ""
echo "============================================"
echo "✅ Claude Code setup complete!"
echo ""
echo "Installed:"
echo "  📦 10 existing skills + 4 custom Noalle skills"
echo "  🤖 4 agents (chief-of-staff, loop-operator, planner, security-reviewer)"
echo "  📋 5 common rules"
echo "  ⚙️  Optimized settings"
echo "  🧠 Serena (semantic code intelligence)"
echo "  📚 Knowledge Graph vault (brand + project context)"
echo "  🔌 3 MCP servers (Serena, Context7, fal.ai)"
echo ""
echo "Next steps:"
echo "  1. Set ANTHROPIC_API_KEY in your environment"
echo "  2. Update FAL_KEY in ~/.claude/mcp-configs/mcp-servers.json"
echo "  3. Open VS Code and install the Claude Code extension"
echo "  4. Try: /brand audit"
echo "============================================"
