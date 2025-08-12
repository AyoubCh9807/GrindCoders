"use client";
import Squares from "@/components/UI/SquaresBg";

export default function Tos() {
  return (
    <div className="relative">
      <div className="absolute inset-0 min-w-full min-h-full top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] opacity-10">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal" // up, down, left, right, diagonal
          borderColor="#fff"
          hoverFillColor="#222"
        />
      </div>

      <div className="flex justify-center px-6 sm:px-10 md:px-20 py-16 animate-pulse">
        <div className="w-full max-w-4xl border-2 border-white/30 bg-white/10 rounded-xl p-6 sm:p-10 text-left space-y-10">
          <h1 className="text-4xl font-bold text-center mb-8 drop-shadow-[0_0_5px_#fff]">
            📜 Terms of Service
          </h1>
          <p className="text-sm text-center text-gray-300">
            <strong>Effective Date:</strong> July 28, 2025
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-2 drop-shadow-[0_0_5px_#fff] animate-pulse">👤 1. Account Rules</h2>
            <ul className="list-disc list-inside text-lg space-y-1">
              <li>
                Each user may create <strong>up to 2 accounts only</strong>.
              </li>
              <li>
                Account sharing, impersonation, or ban evasion is not allowed.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 drop-shadow-[0_0_5px_#fff] animate-pulse">
              🕹️ 2. Fair Play & Game Behavior
            </h2>
            <ul className="list-disc list-inside text-lg space-y-1">
              <li>❌ No cheating, hacking, or third-party tools.</li>
              <li>❌ No intentional disconnections to avoid losing.</li>
              <li>❌ No join/leave spam to lag or crash servers.</li>
              <li>❌ No bug or glitch abuse for advantage.</li>
              <li>✅ Sportsmanship is required — play fair and have fun!</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 drop-shadow-[0_0_5px_#fff] animate-pulse">
              🌐 3. Server Use & Security
            </h2>
            <ul className="list-disc list-inside text-lg space-y-1">
              <li>❌ No web scraping, botting, or automated access.</li>
              <li>
                ❌ Avoid too many concurrent connections from the same IP.
              </li>
              <li>❌ DDoS attacks, API abuse = permanent ban.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 drop-shadow-[0_0_5px_#fff] animate-pulse">
              💬 4. Chat & Community Rules
            </h2>
            <ul className="list-disc list-inside text-lg space-y-1">
              <li>❌ No racism, hate speech, or harassment.</li>
              <li>❌ No chat flooding or spamming.</li>
              <li>❌ No offensive usernames, avatars, or impersonation.</li>
              <li>✅ Be respectful and inclusive — treat others well.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 drop-shadow-[0_0_5px_#fff] animate-pulse">
              🛑 5. Termination of Service
            </h2>
            <p className="text-lg">
              We may suspend or terminate your access for any violations. This
              can be temporary or permanent, and no refunds will be issued.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 drop-shadow-[0_0_5px_#fff] animate-pulse">
              🛠️ 6. Bugs & Reporting
            </h2>
            <p className="text-lg">
              Found a bug? Please report it! Do not exploit bugs — even minor
              ones — for personal gain.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 drop-shadow-[0_0_5px_#fff] animate-pulse">
              🔞 7. Age Requirement
            </h2>
            <p className="text-lg">
              You must be at least 13 years old to use this platform. Under 18?
              Get permission from a guardian where required.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 drop-shadow-[0_0_5px_#fff] animate-pulse">
              💌 8. Partnerships & Business
            </h2>
            <p className="text-lg">
              Interested in sponsoring or collaborating? 👉 DM the owner
              directly!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 drop-shadow-[0_0_5px_#fff] animate-pulse">
              🔐 9. Privacy Policy
            </h2>
            <ul className="list-disc list-inside text-lg space-y-1">
              <li>We collect minimal data: usernames, stats, tokens.</li>
              <li>We never sell or share your info with advertisers.</li>
              <li>We secure your data using industry best practices.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 drop-shadow-[0_0_5px_#fff] animate-pulse">
              ⚖️ 10. Disputes & Arbitration
            </h2>
            <ul className="list-disc list-inside text-lg space-y-1">
              <li>Try to resolve any issues with us first via support.</li>
              <li>
                Unresolved disputes will go to{" "}
                <strong>binding arbitration</strong>.
              </li>
              <li>No lawsuits, just fair conflict resolution.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 drop-shadow-[0_0_5px_#fff] animate-pulse">
              📆 11. Changes to Terms
            </h2>
            <p className="text-lg">
              We may update these terms at any time. You’ll be notified of major
              changes. Continued use means you agree to the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 drop-shadow-[0_0_5px_#fff] animate-pulse">
              📝 12. Contact
            </h2>
            <p className="text-lg">
              Have questions about these terms? Reach out via our support page
               (coming soon) or directly to the owner.
            </p>
          </section>

            <div className="grid place-items-center">
                <button 
                className="px-8 py-4 border-3 border-white/30 bg-white/10 rounded-xl backdrop-blur-sm
                hover:bg-white/30 transition-all duration-200
                "
                >
                    <a
                    className="text-2xl font-bold font-sans" 
                    href="."
                    >
                        Go back
                    </a>
                </button>
            </div>

        </div>
      </div>
    </div>
  );
}
