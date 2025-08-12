export const getStruct_CPP = (returnType: string): string => {
  const type = returnType.trim().toLowerCase();

  switch (type) {
    case "listnode":
      return `
        struct ListNode {
            int val;
            ListNode *next;
            ListNode(int x) : val(x), next(nullptr) {}
        };
      `;
    case "treenode":
      return `
        struct TreeNode {
            int val;
            TreeNode* left;
            TreeNode* right;
            TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
        };
      `;
    case "trienode":
      return `
        struct TrieNode {
            TrieNode* children[26];
            bool isWord;
            TrieNode() : isWord(false) {
              for (int i = 0; i < 26; ++i) children[i] = nullptr;
            }
        };
      `;
    case "listnoded":
      return `
        struct ListNodeD {
            int val;
            ListNodeD* next;
            ListNodeD* prev;
            ListNodeD(int x) : val(x), next(nullptr), prev(nullptr) {}
        };
      `;
    
    default:
      return ""; // on struct or unknown type
  }
};
