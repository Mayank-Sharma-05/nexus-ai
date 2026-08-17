/**
 * NEXUS AI — Module 1: Authentication & User Lifecycle Management
 * Handles Sign-up, Sign-in, Google OAuth simulation, Password Reset, Profile Settings,
 * Role permissions, and 30-day soft account deletion grace window.
 */

window.NexusAuthModule = {
  renderProfile() {
    const user = window.nexusStore.get("user");
    const isDeletionScheduled = !!user.scheduledDeletionAt;

    return `
      <div class="max-w-4xl mx-auto p-6 sm:p-10">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-800 pb-6 mb-8">
          <div>
            <span class="badge-pill mb-2">Module 1 — User Management</span>
            <h1 class="text-3xl font-extrabold text-white">Account Settings & Profile</h1>
            <p class="text-gray-400 text-sm">Manage your profile, API keys, and security preferences.</p>
          </div>
          <button onclick="window.NexusAuthModule.openAuthModal('login')" class="btn-secondary text-sm">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> Switch Account
          </button>
        </div>

        ${isDeletionScheduled ? `
          <div class="mb-8 p-4 bg-rose-950/40 border border-rose-500/50 rounded-xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-triangle-exclamation text-rose-400 text-xl"></i>
              <div>
                <div class="text-sm font-bold text-rose-300">Account Scheduled for Permanent Deletion</div>
                <div class="text-xs text-rose-400">All data will be permanently removed in 30 days. You can cancel deletion anytime.</div>
              </div>
            </div>
            <button onclick="window.NexusAuthModule.cancelAccountDeletion()" class="btn-electric text-xs bg-rose-600 hover:bg-rose-500">
              Cancel Deletion
            </button>
          </div>
        ` : ''}

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Profile Card -->
          <div class="glass-panel p-6 flex flex-col items-center text-center">
            <div class="relative mb-4">
              <img id="profile-avatar-img" class="w-24 h-24 rounded-full border-2 border-cyan-400/60 object-cover shadow-lg" src="${user.avatarUrl}" alt="Avatar">
              <button onclick="window.NexusAuthModule.cycleAvatar()" title="Change avatar" class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-cyan-400 text-black flex items-center justify-center text-xs font-bold hover:bg-cyan-300">
                <i class="fa-solid fa-camera"></i>
              </button>
            </div>
            <h3 class="text-lg font-bold text-white">${user.name}</h3>
            <p class="text-xs text-gray-400 mb-3">${user.email}</p>
            <div class="flex gap-2 mb-4">
              <span class="badge-pill uppercase text-[10px]">${user.role}</span>
              <span class="badge-emerald uppercase text-[10px]">Verified</span>
            </div>
            <div class="w-full pt-4 border-t border-gray-800 text-left space-y-2 text-xs text-gray-400">
              <div class="flex justify-between"><span>Tokens Consumed:</span> <strong class="text-cyan-400">${user.tokensConsumed.toLocaleString()}</strong></div>
              <div class="flex justify-between"><span>Storage Quota:</span> <strong class="text-white">${user.storageUsedMB} / ${user.storageQuotaMB} MB</strong></div>
            </div>
          </div>

          <!-- Edit Profile Form -->
          <div class="glass-panel p-6 md:col-span-2 space-y-5">
            <h3 class="text-lg font-bold text-white mb-2">Personal Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-400 uppercase font-semibold mb-1">Display Name</label>
                <input id="profile-name-input" type="text" class="nexus-input" value="${user.name}">
              </div>
              <div>
                <label class="block text-xs text-gray-400 uppercase font-semibold mb-1">Email Address</label>
                <input id="profile-email-input" type="email" class="nexus-input" value="${user.email}" disabled>
              </div>
            </div>

            <div>
              <label class="block text-xs text-gray-400 uppercase font-semibold mb-1">Professional Bio</label>
              <textarea id="profile-bio-input" rows="3" class="nexus-input">${user.bio}</textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-400 uppercase font-semibold mb-1">GitHub URL</label>
                <input id="profile-github-input" type="url" class="nexus-input" value="${user.githubUrl}">
              </div>
              <div>
                <label class="block text-xs text-gray-400 uppercase font-semibold mb-1">LinkedIn URL</label>
                <input id="profile-linkedin-input" type="url" class="nexus-input" value="${user.linkedinUrl}">
              </div>
            </div>

            <div class="pt-4 flex justify-between items-center border-t border-gray-800">
              <button onclick="window.NexusAuthModule.saveProfile()" class="btn-electric text-sm">
                Save Profile Changes
              </button>
              <button onclick="window.NexusAuthModule.requestAccountDeletion()" class="text-xs text-rose-400 hover:text-rose-300 font-semibold underline">
                Delete Account...
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    // nothing specific on init
  },

  saveProfile() {
    const name = document.getElementById("profile-name-input").value;
    const bio = document.getElementById("profile-bio-input").value;
    const githubUrl = document.getElementById("profile-github-input").value;
    const linkedinUrl = document.getElementById("profile-linkedin-input").value;

    const user = { ...window.nexusStore.get("user"), name, bio, githubUrl, linkedinUrl };
    window.nexusStore.set("user", user);
    window.nexusApp.showToast("✓ Profile information updated successfully!");
  },

  cycleAvatar() {
    const avatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80"
    ];
    const user = window.nexusStore.get("user");
    const currentIdx = avatars.indexOf(user.avatarUrl);
    const nextAvatar = avatars[(currentIdx + 1) % avatars.length];
    window.nexusStore.set("user", { ...user, avatarUrl: nextAvatar });
    const img = document.getElementById("profile-avatar-img");
    if (img) img.src = nextAvatar;
    window.nexusApp.showToast("Avatar updated!");
  },

  requestAccountDeletion() {
    if (confirm("Are you sure you want to schedule account deletion? You will enter a 30-day grace period during which all operations can be cancelled.")) {
      const scheduledDate = new Date(Date.now() + 30 * 86400000).toISOString();
      window.nexusStore.set("user.scheduledDeletionAt", scheduledDate);
      window.nexusStore.addAuditLog("ACCOUNT_DELETION_SCHEDULED", window.nexusStore.get("user.email"), "30-day grace period started");
      window.nexusApp.renderView();
      window.nexusApp.showToast("Account deletion scheduled with 30-day undo window.");
    }
  },

  cancelAccountDeletion() {
    window.nexusStore.set("user.scheduledDeletionAt", null);
    window.nexusStore.addAuditLog("ACCOUNT_DELETION_CANCELLED", window.nexusStore.get("user.email"), "Grace period aborted by user");
    window.nexusApp.renderView();
    window.nexusApp.showToast("✓ Account deletion cancelled successfully!");
  },

  openAuthModal(type = "login") {
    const modalContainer = document.getElementById("global-modal-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="nexus-modal-overlay" onclick="if(event.target === this) window.NexusAuthModule.closeAuthModal()">
        <div class="nexus-modal-content p-6 max-w-md">
          <div class="flex justify-between items-center border-b border-gray-800 pb-4 mb-5">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-black font-extrabold text-xs">⚡</div>
              <h3 class="text-lg font-bold text-white">${type === 'login' ? 'Sign In to Nexus AI' : 'Create Free Account'}</h3>
            </div>
            <button onclick="window.NexusAuthModule.closeAuthModal()" class="text-gray-400 hover:text-white">✕</button>
          </div>

          <!-- OAuth Google Button -->
          <button onclick="window.NexusAuthModule.handleGoogleOAuth()" class="w-full py-3 px-4 rounded-xl bg-gray-900 border border-gray-700 hover:border-gray-500 text-sm font-medium text-white flex items-center justify-center gap-3 transition mb-4">
            <i class="fa-brands fa-google text-rose-400"></i> Continue with Google (One-Click)
          </button>

          <div class="flex items-center my-4">
            <div class="flex-grow border-t border-gray-800"></div>
            <span class="flex-shrink mx-4 text-xs text-gray-500 font-mono uppercase">or email & password</span>
            <div class="flex-grow border-t border-gray-800"></div>
          </div>

          <form onsubmit="event.preventDefault(); window.NexusAuthModule.submitAuth('${type}');" class="space-y-4">
            <div>
              <label class="block text-xs text-gray-400 uppercase font-semibold mb-1">Email Address</label>
              <input id="auth-email-input" type="email" required placeholder="name@company.com" class="nexus-input" value="alex.rivera@example.com">
            </div>
            <div>
              <label class="block text-xs text-gray-400 uppercase font-semibold mb-1">Password</label>
              <input id="auth-pass-input" type="password" required placeholder="••••••••" class="nexus-input" value="SuperSecurePass2026!">
            </div>

            <button type="submit" class="w-full btn-electric py-3 text-sm font-bold justify-center mt-2">
              ${type === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div class="mt-5 text-center text-xs text-gray-400">
            ${type === 'login' 
              ? `Don't have an account? <a href="#" onclick="window.NexusAuthModule.openAuthModal('signup')" class="text-cyan-400 font-semibold hover:underline">Sign up</a>` 
              : `Already registered? <a href="#" onclick="window.NexusAuthModule.openAuthModal('login')" class="text-cyan-400 font-semibold hover:underline">Sign in</a>`}
          </div>
        </div>
      </div>
    `;
  },

  closeAuthModal() {
    const modalContainer = document.getElementById("global-modal-container");
    if (modalContainer) modalContainer.innerHTML = "";
  },

  handleGoogleOAuth() {
    window.nexusApp.showToast("✓ Authenticated via Google PKCE OAuth 2.0");
    this.closeAuthModal();
    window.nexusApp.renderView();
  },

  submitAuth(type) {
    const email = document.getElementById("auth-email-input").value;
    const user = { ...window.nexusStore.get("user"), email, name: email.split("@")[0] };
    window.nexusStore.set("user", user);
    window.nexusApp.showToast(`✓ Welcome back, ${user.name}!`);
    this.closeAuthModal();
    window.nexusApp.renderView();
  }
};
