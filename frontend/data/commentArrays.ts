 const appComments = [
  "Just solved my first problem here, feels great!",
  "This platform is so smooth and easy to use.",
  "Loving the point system, keeps me motivated.",
  "Can someone explain how the leaderboard works?",
  "I’m stuck on the medium problems, any tips?",
  "The UI is really clean and intuitive, well done!",
  "Would love more hard problems added soon.",
  "How often do you add new challenges?",
  "I like that the hints don’t give away the solution.",
  "The animations make the app fun to use!",
  "Is there a way to track my progress over time?",
  "I wish there was a dark light mode toggle.",
  "Can we have a feature to discuss solutions?",
  "The daily challenge is my favorite part.",
  "I appreciate the fast code execution feature.",
  "The points and badges system is addictive.",
  "Is the app open source? Would love to contribute.",
  "Can I link my GitHub to share solutions?",
  "Great community here, super helpful folks!",
  "Sometimes the test cases feel a bit tricky.",
  "Can we get hints for hard problems too?",
  "I enjoy competing with friends on the leaderboard.",
  "The UI could be a bit faster on mobile.",
  "Would be cool to have themed profiles.",
  "Thanks for fixing the bugs so quickly!",
  "Learning so much from this platform every day.",
  "Any plans for a mobile app version?",
  "Really enjoy the friendly UI colors and fonts.",
  "The problem descriptions are very clear.",
  "Keep up the amazing work, team!",
];

const randomUsernames = [
  "Luna_xStar99",       // woman
  "Iron_Wolf_77",
  "SilentShadowX",
  "Ruby_Flame_88",      // woman
  "DarkKnight42",
  "SteelHawk_X9",
  "VioletWave_007",     // woman
  "StormRiderX",
  "Iron_Fang_21",
  "CrystalBloom_xX",    // woman
  "NightWolf_3000",
  "Steel_ArrowX",
  "MoonGlow_77",        // woman
  "FireBlade_xX",
  "Shadow_Fang42",
  "Sapphire_Sky99",     // woman
  "WolfClaw_xx",
  "IronHammer77",
  "JadeMist_X9",        // woman
  "SilverArrow_23",
  "DarkBlade_x",
  "AmberStar007",       // woman
  "Ghost_Wolf_45",
  "SteelFangX",
  "Pearl_Storm_91",     // woman
  "ThunderClaw_xX",
  "ShadowWolf_88",
  "RoseFlame_007",      // woman
  "IronStorm_xx",
  "NightClaw99"
];



  class VirtualComment {
    
    id: number;
    username: string;
    content: string;
    pfpUrl: string;
    
    constructor(
      id: number, 
      username: string, 
      content: string,
      pfpUrl: string
    ) {
      this.id = id;
      this.username = username;
      this.content = content;
      this.pfpUrl = pfpUrl
    }
  }

  let counterMen = 0
  let counterWomen = 0

  const commentArray: VirtualComment[] = []
  for(let i = 0; i < 30; i++) {
    const url: string = (
      i % 3 == 0
      ? `https://randomuser.me/api/portraits/women/${counterWomen}.jpg`
      : `https://randomuser.me/api/portraits/men/${counterMen}.jpg`
    )
      url.includes("men")
    ? counterMen++
    : counterWomen++
    
    const newComment = new VirtualComment(i, randomUsernames[i], appComments[i], url)
    commentArray.push(newComment)
  }

export default commentArray