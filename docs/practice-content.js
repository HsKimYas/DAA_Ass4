window.A4_PRACTICE={
  "title": "Assignment 4 — Defence Practice",
  "status": "Ungraded public learning practice; separate from assessed Moodle questions",
  "minutes": 25,
  "raw_max": 15,
  "grade_max": 50,
  "questions": [
    {
      "id": "S02",
      "topic": "LCS reconstruction",
      "type": "single",
      "stem": "For a=\"ABCA\" and b=\"BAC\", which proposed output is an optimal common subsequence?",
      "options": [
        {
          "text": "BCA",
          "correct": false,
          "explanation": "BCA is not a subsequence of BAC: its A occurs before C in BAC."
        },
        {
          "text": "BC",
          "correct": true,
          "explanation": "BC occurs in order in both strings. Length 3 would require BAC, which is not a subsequence of ABCA; therefore length 2 is optimal."
        },
        {
          "text": "CA",
          "correct": false,
          "explanation": "CA is not a subsequence of BAC: its C comes after A."
        },
        {
          "text": "AB",
          "correct": false,
          "explanation": "AB is not a subsequence of BAC: B comes before A."
        }
      ]
    },
    {
      "id": "S03",
      "topic": "Interval recurrence",
      "type": "single",
      "stem": "For sizes=[3,1,2], consider the last split k=0 of interval [0,2]. The subinterval [1,2] costs 3 to merge. What candidate total does this split give?",
      "options": [
        {
          "text": "3",
          "correct": false,
          "explanation": "3 pays only for merging the right subinterval; the final merge is missing."
        },
        {
          "text": "6",
          "correct": false,
          "explanation": "6 is the final merge cost, but the earlier right-subinterval cost is also paid."
        },
        {
          "text": "9",
          "correct": true,
          "explanation": "dp[0][0]+dp[1][2]+sum(0..2)=0+3+6=9."
        },
        {
          "text": "10",
          "correct": false,
          "explanation": "10 is the candidate for last split k=1: merging sizes 3 and 1 first costs 4, then 6."
        }
      ]
    },
    {
      "id": "S05",
      "topic": "Tree states",
      "type": "single",
      "stem": "A rooted vertex u has weight 5 and two leaf children of weights -2 and 4. What is (take[u],skip[u]) when the empty set is allowed?",
      "options": [
        {
          "text": "(7,4)",
          "correct": false,
          "explanation": "Taking u excludes both children; adding the magnitude of a negative child is invalid."
        },
        {
          "text": "(5,4)",
          "correct": true,
          "explanation": "Taking u gives 5. Skipping u permits max(0,-2)+max(0,4)=4."
        },
        {
          "text": "(9,0)",
          "correct": false,
          "explanation": "Taking both u and its child of weight 4 violates independence; skipping u can earn 4."
        },
        {
          "text": "(5,2)",
          "correct": false,
          "explanation": "Skipping u does not force selection of the negative child: max is taken separately for each child."
        }
      ]
    },
    {
      "id": "S06",
      "topic": "Naive boundaries",
      "type": "single",
      "stem": "Return all zero-based starts of pattern=\"aba\" in text=\"ababa\", including overlaps.",
      "options": [
        {
          "text": "[0]",
          "correct": false,
          "explanation": "The overlapping occurrence at 2 is missing."
        },
        {
          "text": "[0,2]",
          "correct": true,
          "explanation": "Windows at 0 and 2 equal aba. Their starts are distinct even though the windows overlap."
        },
        {
          "text": "[0,1,2]",
          "correct": false,
          "explanation": "The window at 1 is bab, not aba."
        },
        {
          "text": "[2]",
          "correct": false,
          "explanation": "The first occurrence at 0 is missing."
        }
      ]
    },
    {
      "id": "S08",
      "topic": "KMP fallback",
      "type": "single",
      "stem": "KMP has just matched the entire nonempty pattern=\"aaaa\", whose pi array is [0,1,2,3]. What j should be used to continue searching for overlaps?",
      "options": [
        {
          "text": "0",
          "correct": false,
          "explanation": "Resetting to 0 discards a valid three-character overlap."
        },
        {
          "text": "1",
          "correct": false,
          "explanation": "A one-character border exists, but it is not the longest fallback."
        },
        {
          "text": "3",
          "correct": true,
          "explanation": "Set j=pi[m-1]=pi[3]=3. Three matched a characters can begin the next occurrence."
        },
        {
          "text": "4",
          "correct": false,
          "explanation": "j=4 is a complete match, not a valid next character position in this pattern."
        }
      ]
    },
    {
      "id": "S09",
      "topic": "Rolling update",
      "type": "single",
      "stem": "A width-2 rolling hash uses base=31, modulus=101 and ASCII codes. In text=\"ace\", hash(\"ac\")=76. Sliding to \"ce\" removes ASCII(a)=97 and adds ASCII(e)=101. What is the normalized next hash?",
      "options": [
        {
          "text": "39",
          "correct": true,
          "explanation": "((76-97*31)*31+101) mod101, normalized, is 39. Directly, 99*31+101=3170 and 3170 mod101=39."
        },
        {
          "text": "76",
          "correct": false,
          "explanation": "76 belongs to the old window ac; the update changes it."
        },
        {
          "text": "0",
          "correct": false,
          "explanation": "The added code is divisible by 101, but the remaining contribution of c is not."
        },
        {
          "text": "101",
          "correct": false,
          "explanation": "A normalized residue modulo 101 lies in 0..100."
        }
      ]
    },
    {
      "id": "S10",
      "topic": "Hash collision",
      "type": "single",
      "stem": "pattern=\"bc\". Candidate windows \"bc\" and \"ek\" both hash to 6 with ASCII, base=31, modulus=101. Which rule guarantees exact search results?",
      "options": [
        {
          "text": "Report both because the hashes agree.",
          "correct": false,
          "explanation": "ek is a false positive: its characters differ from the pattern."
        },
        {
          "text": "Report neither because a collision exists.",
          "correct": false,
          "explanation": "A collision does not invalidate the real match bc."
        },
        {
          "text": "Report only bc after comparing actual characters.",
          "correct": true,
          "explanation": "Equal hashes only identify candidates; character verification keeps bc and rejects ek."
        },
        {
          "text": "Treat hash equality as proof that the strings are identical.",
          "correct": false,
          "explanation": "A finite hash space permits collisions. Equality of hashes does not prove string equality."
        }
      ]
    },
    {
      "id": "S13",
      "topic": "Doubling ranks",
      "type": "single",
      "stem": "In one doubling round, rank=[2,0,1] and compared half-length k=1. Use -1 for an out-of-range second rank. What pair represents suffix start i=2?",
      "options": [
        {
          "text": "(1,0)",
          "correct": false,
          "explanation": "rank[i+k] is out of range; it must be -1, not 0."
        },
        {
          "text": "(2,-1)",
          "correct": false,
          "explanation": "The first rank is rank[2]=1, not the original index 2."
        },
        {
          "text": "(1,-1)",
          "correct": true,
          "explanation": "The pair is (rank[2],rank[3])=(1,-1) with the stated missing-rank convention."
        },
        {
          "text": "(0,1)",
          "correct": false,
          "explanation": "This uses unrelated rank entries and does not represent start 2."
        }
      ]
    },
    {
      "id": "S14",
      "topic": "LCP convention",
      "type": "single",
      "stem": "text=\"aaaa\", sa=[3,2,1,0]. lcp[0]=0 and lcp[i] compares suffixes sa[i-1] and sa[i]. What is lcp[2]?",
      "options": [
        {
          "text": "0",
          "correct": false,
          "explanation": "The two suffixes share initial a characters."
        },
        {
          "text": "1",
          "correct": false,
          "explanation": "They share aa, so one is too short."
        },
        {
          "text": "2",
          "correct": true,
          "explanation": "sa[1]=2 gives aa; sa[2]=1 gives aaa. Their common prefix has length 2."
        },
        {
          "text": "3",
          "correct": false,
          "explanation": "The shorter suffix aa has only two characters."
        }
      ]
    },
    {
      "id": "S15",
      "topic": "Failure link",
      "type": "single",
      "stem": "A trie is built from patterns=[\"ab\",\"bab\"]. Its states are ε,a,ab,b,ba,bab. Where does the failure link of state bab point?",
      "options": [
        {
          "text": "ε",
          "correct": false,
          "explanation": "A longer matching proper suffix exists: ab."
        },
        {
          "text": "b",
          "correct": false,
          "explanation": "b is a proper suffix and a trie prefix, but ab is longer."
        },
        {
          "text": "ba",
          "correct": false,
          "explanation": "ba is a prefix of bab, not a suffix of bab."
        },
        {
          "text": "ab",
          "correct": true,
          "explanation": "ab is the longest proper suffix of bab that is also a trie prefix."
        }
      ]
    },
    {
      "id": "M16",
      "topic": "LCS properties",
      "type": "multiple",
      "stem": "For a=\"AB\" and b=\"BA\", select all true statements.",
      "options": [
        {
          "text": "The LCS length is 1.",
          "correct": true,
          "explanation": "The character order is reversed, so both characters cannot be kept; either individual character gives length 1."
        },
        {
          "text": "AB is a common subsequence.",
          "correct": false,
          "explanation": "AB is not a subsequence of BA."
        },
        {
          "text": "A is an optimal common subsequence.",
          "correct": true,
          "explanation": "A occurs in both strings and attains the optimum length 1."
        },
        {
          "text": "The empty sequence is the only common subsequence.",
          "correct": false,
          "explanation": "A and B are nonempty common subsequences."
        },
        {
          "text": "B is an optimal common subsequence.",
          "correct": true,
          "explanation": "B also occurs in both strings and attains the optimum length 1."
        }
      ]
    },
    {
      "id": "M17",
      "topic": "Tree reconstruction",
      "type": "multiple",
      "stem": "The path 0—1—2 has weights=[-2,0,-3]. The empty set is allowed. Select all true statements.",
      "options": [
        {
          "text": "{0,1} is an independent set.",
          "correct": false,
          "explanation": "0 and 1 are adjacent, so this set is not independent."
        },
        {
          "text": "The empty set is optimal.",
          "correct": true,
          "explanation": "The empty set has weight 0, and no positive weights are available."
        },
        {
          "text": "{0,2} is optimal.",
          "correct": false,
          "explanation": "Its weight is -5, below the feasible weight 0."
        },
        {
          "text": "{1} is optimal.",
          "correct": true,
          "explanation": "The single zero-weight vertex is independent and has the optimum weight 0."
        },
        {
          "text": "Changing the root can change the optimum weight.",
          "correct": false,
          "explanation": "Rooting changes the computation order, not the underlying independent-set optimum."
        }
      ]
    },
    {
      "id": "M18",
      "topic": "KMP invariants",
      "type": "multiple",
      "stem": "Consider the required KMP search, including the A4 empty-pattern convention. Select all true statements.",
      "options": [
        {
          "text": "After a full nonempty-pattern match, j=pi[m-1] preserves possible overlaps.",
          "correct": true,
          "explanation": "The longest proper border can already be the beginning of the next match."
        },
        {
          "text": "Every mismatch requires moving the text index backwards.",
          "correct": false,
          "explanation": "KMP reuses prefix information; the text index never needs to move backwards."
        },
        {
          "text": "A fallback can change j while keeping the current text index unchanged.",
          "correct": true,
          "explanation": "The same text character can be compared after shortening the matched prefix."
        },
        {
          "text": "An empty pattern has n+1 starting boundaries in a text of length n.",
          "correct": true,
          "explanation": "The boundaries are 0 through n inclusive."
        },
        {
          "text": "Replacing the implementation by built-in substring search satisfies the required-method rule.",
          "correct": false,
          "explanation": "The assignment requires a prefix function and KMP implementation; built-in search cannot replace it."
        }
      ]
    },
    {
      "id": "M19",
      "topic": "Dictionary counts",
      "type": "multiple",
      "stem": "patterns=[\"a\",\"aa\",\"a\"], text=\"aaa\". Count overlaps and keep original dictionary positions. Select all true statements.",
      "options": [
        {
          "text": "The aa pattern is counted only once because its occurrences overlap.",
          "correct": false,
          "explanation": "aa starts at both 0 and 1; overlaps count."
        },
        {
          "text": "The first dictionary position has count 3.",
          "correct": true,
          "explanation": "a starts at 0,1,2, giving 3."
        },
        {
          "text": "The second dictionary position has count 2.",
          "correct": true,
          "explanation": "aa starts at 0 and 1, giving 2."
        },
        {
          "text": "Duplicate patterns must be removed from the output.",
          "correct": false,
          "explanation": "Duplicates keep separate output columns even if they share a trie terminal."
        },
        {
          "text": "The third dictionary position has count 3.",
          "correct": true,
          "explanation": "The duplicate a has the same count as the first a."
        }
      ]
    },
    {
      "id": "M20",
      "topic": "Independent texts",
      "type": "multiple",
      "stem": "patterns=[\"cat\",\"at\"], texts=[\"cat\", \"\"]. Select all true statements about the required Aho output and reset behaviour.",
      "options": [
        {
          "text": "The first output row is [1,1].",
          "correct": true,
          "explanation": "cat occurs once, and its suffix pattern at occurs once."
        },
        {
          "text": "Each output row corresponds to a dictionary pattern rather than a text.",
          "correct": false,
          "explanation": "Rows correspond to texts; columns follow original dictionary positions."
        },
        {
          "text": "The second output row is [0,0].",
          "correct": true,
          "explanation": "Both nonempty patterns have zero occurrences in the empty text."
        },
        {
          "text": "The empty text must retain the previous text's counts.",
          "correct": false,
          "explanation": "Each text starts with reset state and counts."
        },
        {
          "text": "With texts=[], the output counts is [].",
          "correct": true,
          "explanation": "No texts means no output rows."
        }
      ]
    }
  ],
  "policy": "Single: 1 or 0. Multiple: max(0,c/k-w/(2k)), with k=2 or 3 correct options. Grade=raw/15*50."
};
