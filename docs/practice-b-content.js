window.A4_PRACTICE={
  "title": "Assignment 4 — Defence Practice B",
  "minutes": 25,
  "raw_max": 15,
  "grade_max": 50,
  "questions": [
    {
      "id": "PRACTICE-B-20261103-Q01-0227",
      "topic": "LCS — applied reasoning",
      "type": "single",
      "stem": "For a=\"CACDCCD\" and b=\"CDBABCB\", which output satisfies BOTH the optimal LCS length and the subsequence reconstruction requirement?",
      "options": [
        {
          "text": "length=3; sequence=\"CDC\"",
          "correct": true,
          "explanation": "The maximum length is 3. The optimal strings are [\"CAC\",\"CDC\"]. A witness must preserve character order in both inputs, not merely contain shared characters."
        },
        {
          "text": "length=3; sequence=\"DAB\"",
          "correct": false,
          "explanation": "The maximum length is 3. The optimal strings are [\"CAC\",\"CDC\"]. A witness must preserve character order in both inputs, not merely contain shared characters."
        },
        {
          "text": "length=3; sequence=\"CAB\"",
          "correct": false,
          "explanation": "The maximum length is 3. The optimal strings are [\"CAC\",\"CDC\"]. A witness must preserve character order in both inputs, not merely contain shared characters."
        },
        {
          "text": "length=3; sequence=\"CCC\"",
          "correct": false,
          "explanation": "The maximum length is 3. The optimal strings are [\"CAC\",\"CDC\"]. A witness must preserve character order in both inputs, not merely contain shared characters."
        }
      ]
    },
    {
      "id": "PRACTICE-B-20261103-Q02-0228",
      "topic": "Interval DP — applied reasoning",
      "type": "single",
      "stem": "Adjacent merging uses sizes=[8,5,4,2]. Every merge costs the combined size. Return [C,K], where C is the minimum total cost and K is the SMALLEST last-split index among optimal plans for [0,3]. Which pair is correct?",
      "options": [
        {
          "text": "[36,1]",
          "correct": false,
          "explanation": "Exhaustively checking all five merge trees gives minimum 36; the optimal last-split indices are [0]. Both child costs and the full interval sum must be paid."
        },
        {
          "text": "[38,0]",
          "correct": false,
          "explanation": "Exhaustively checking all five merge trees gives minimum 36; the optimal last-split indices are [0]. Both child costs and the full interval sum must be paid."
        },
        {
          "text": "[36,0]",
          "correct": true,
          "explanation": "Exhaustively checking all five merge trees gives minimum 36; the optimal last-split indices are [0]. Both child costs and the full interval sum must be paid."
        },
        {
          "text": "[34,0]",
          "correct": false,
          "explanation": "Exhaustively checking all five merge trees gives minimum 36; the optimal last-split indices are [0]. Both child costs and the full interval sum must be paid."
        }
      ]
    },
    {
      "id": "PRACTICE-B-20261103-Q03-0229",
      "topic": "Tree DP — applied reasoning",
      "type": "single",
      "stem": "A tree has weights=[8,1,7,6,2,8] and edges=[[0,1],[0,2],[1,3],[1,4],[2,5]]. The empty set is allowed. Return [W,T], where W is the maximum independent-set weight and T is the best weight when vertex 0 is REQUIRED to be selected. Which pair is correct?",
      "options": [
        {
          "text": "[24,24]",
          "correct": true,
          "explanation": "The optimal sets are [[0,3,4,5]], each of weight 24. Requiring vertex 0 excludes its neighbours; optimise the remaining permitted subtrees separately."
        },
        {
          "text": "[26,25]",
          "correct": false,
          "explanation": "The optimal sets are [[0,3,4,5]], each of weight 24. Requiring vertex 0 excludes its neighbours; optimise the remaining permitted subtrees separately."
        },
        {
          "text": "[22,22]",
          "correct": false,
          "explanation": "The optimal sets are [[0,3,4,5]], each of weight 24. Requiring vertex 0 excludes its neighbours; optimise the remaining permitted subtrees separately."
        },
        {
          "text": "[21,21]",
          "correct": false,
          "explanation": "The optimal sets are [[0,3,4,5]], each of weight 24. Requiring vertex 0 excludes its neighbours; optimise the remaining permitted subtrees separately."
        }
      ]
    },
    {
      "id": "PRACTICE-B-20261103-Q04-0230",
      "topic": "Naive search — applied reasoning",
      "type": "single",
      "stem": "For text=\"xaabaabaabyy\" and pattern=\"aabaab\", a faulty search advances by m after a match and by 1 after a mismatch. It checks the final legal start. Which list contains exactly the valid starts that this search MISSES? All indices are zero-based.",
      "options": [
        {
          "text": "[1]",
          "correct": false,
          "explanation": "All valid starts are [1,4]. The faulty search reports [1]; subtracting these gives [4]."
        },
        {
          "text": "[5]",
          "correct": false,
          "explanation": "All valid starts are [1,4]. The faulty search reports [1]; subtracting these gives [4]."
        },
        {
          "text": "[4]",
          "correct": true,
          "explanation": "All valid starts are [1,4]. The faulty search reports [1]; subtracting these gives [4]."
        },
        {
          "text": "[1,4]",
          "correct": false,
          "explanation": "All valid starts are [1,4]. The faulty search reports [1]; subtracting these gives [4]."
        }
      ]
    },
    {
      "id": "PRACTICE-B-20261103-Q05-0231",
      "topic": "Prefix fallback — applied reasoning",
      "type": "single",
      "stem": "KMP uses pattern=\"aabaaab\" and has matched its first 2 characters. The next unconsumed text character is \"c\" and mismatches pattern[2]. Return [F,J]: F is the first prefix-function fallback; J is the state AFTER processing this character, including any further fallbacks. Which pair is correct?",
      "options": [
        {
          "text": "[1,0]",
          "correct": true,
          "explanation": "The prefix function is [0,1,0,1,2,2,3]. First use pi[1]=1; retry the same character until a valid prefix can be extended. The resulting state is 0."
        },
        {
          "text": "[0,2]",
          "correct": false,
          "explanation": "The prefix function is [0,1,0,1,2,2,3]. First use pi[1]=1; retry the same character until a valid prefix can be extended. The resulting state is 0."
        },
        {
          "text": "[0,0]",
          "correct": false,
          "explanation": "The prefix function is [0,1,0,1,2,2,3]. First use pi[1]=1; retry the same character until a valid prefix can be extended. The resulting state is 0."
        },
        {
          "text": "[0,1]",
          "correct": false,
          "explanation": "The prefix function is [0,1,0,1,2,2,3]. First use pi[1]=1; retry the same character until a valid prefix can be extended. The resulting state is 0."
        }
      ]
    },
    {
      "id": "PRACTICE-B-20261103-Q06-0233",
      "topic": "KMP — applied reasoning",
      "type": "single",
      "stem": "KMP scans text=\"abaabaabaabaabaabaa\" with pattern=\"abaabaa\". After every full match it immediately sets j=pi[m-1]. Return [R,J], where R is the number of reported occurrences and J is the retained state after the entire text. Which pair is correct?",
      "options": [
        {
          "text": "[6,5]",
          "correct": false,
          "explanation": "The reported starts are [0,3,6,9,12]. With pi=[0,0,1,1,2,3,4], the retained final state is 4. A completed match is reduced before the next character is read."
        },
        {
          "text": "[7,6]",
          "correct": false,
          "explanation": "The reported starts are [0,3,6,9,12]. With pi=[0,0,1,1,2,3,4], the retained final state is 4. A completed match is reduced before the next character is read."
        },
        {
          "text": "[3,2]",
          "correct": false,
          "explanation": "The reported starts are [0,3,6,9,12]. With pi=[0,0,1,1,2,3,4], the retained final state is 4. A completed match is reduced before the next character is read."
        },
        {
          "text": "[5,4]",
          "correct": true,
          "explanation": "The reported starts are [0,3,6,9,12]. With pi=[0,0,1,1,2,3,4], the retained final state is 4. A completed match is reduced before the next character is read."
        }
      ]
    },
    {
      "id": "PRACTICE-B-20261103-Q07-0234",
      "topic": "Rolling hash — applied reasoning",
      "type": "single",
      "stem": "A width-4 rolling hash scans \"eebdcb\" using ASCII codes, base 31 and modulus 101, with the leftmost code at the highest power. Return the normalized hashes after the FIRST and SECOND slides from the initial window. Which pair is correct?",
      "options": [
        {
          "text": "[15,100]",
          "correct": false,
          "explanation": "The next windows are ebdc and bdcb. Direct polynomial evaluation gives residues 13 and 97. Each slide removes the outgoing highest-power term, shifts, then appends."
        },
        {
          "text": "[13,97]",
          "correct": true,
          "explanation": "The next windows are ebdc and bdcb. Direct polynomial evaluation gives residues 13 and 97. Each slide removes the outgoing highest-power term, shifts, then appends."
        },
        {
          "text": "[10,100]",
          "correct": false,
          "explanation": "The next windows are ebdc and bdcb. Direct polynomial evaluation gives residues 13 and 97. Each slide removes the outgoing highest-power term, shifts, then appends."
        },
        {
          "text": "[15,94]",
          "correct": false,
          "explanation": "The next windows are ebdc and bdcb. Direct polynomial evaluation gives residues 13 and 97. Each slide removes the outgoing highest-power term, shifts, then appends."
        }
      ]
    },
    {
      "id": "PRACTICE-B-20261103-Q08-0235",
      "topic": "Exact RK — applied reasoning",
      "type": "single",
      "stem": "Exact RK searches text=\"abdjzzdjababbc\" for pattern=\"ab\" using ASCII, base 31 and modulus 101. It examines EVERY width-2 window, including overlaps. Return [C,R], where C counts equal-hash candidates and R counts reported exact matches. Which pair is correct?",
      "options": [
        {
          "text": "[5,4]",
          "correct": false,
          "explanation": "Equal-hash starts: [0,2,3,6,8,10]. Exact-match starts: [0,8,10]. Character verification rejects collisions, including dj."
        },
        {
          "text": "[3,1]",
          "correct": false,
          "explanation": "Equal-hash starts: [0,2,3,6,8,10]. Exact-match starts: [0,8,10]. Character verification rejects collisions, including dj."
        },
        {
          "text": "[4,1]",
          "correct": false,
          "explanation": "Equal-hash starts: [0,2,3,6,8,10]. Exact-match starts: [0,8,10]. Character verification rejects collisions, including dj."
        },
        {
          "text": "[6,3]",
          "correct": true,
          "explanation": "Equal-hash starts: [0,2,3,6,8,10]. Exact-match starts: [0,8,10]. Character verification rejects collisions, including dj."
        }
      ]
    },
    {
      "id": "PRACTICE-B-20261103-Q09-0236",
      "topic": "Suffix doubling — applied reasoning",
      "type": "single",
      "stem": "For text=\"cbaabb\", initial ranks are [2,1,0,0,1,1]. Perform ONE doubling round with k=1, using -1 beyond the text. Equal rank pairs share a rank; distinct pairs receive consecutive ranks from 0. Which new rank array is in ORIGINAL start-index order?",
      "options": [
        {
          "text": "[1,5,2,3,0,4]",
          "correct": false,
          "explanation": "The original-order pairs are [[2,1],[1,0],[0,0],[0,1],[1,1],[1,-1]]. Ranking their distinct sorted values gives [5,3,0,1,4,2]."
        },
        {
          "text": "[5,3,0,1,4,2]",
          "correct": true,
          "explanation": "The original-order pairs are [[2,1],[1,0],[0,0],[0,1],[1,1],[1,-1]]. Ranking their distinct sorted values gives [5,3,0,1,4,2]."
        },
        {
          "text": "[2,0,3,4,1,5]",
          "correct": false,
          "explanation": "The original-order pairs are [[2,1],[1,0],[0,0],[0,1],[1,1],[1,-1]]. Ranking their distinct sorted values gives [5,3,0,1,4,2]."
        },
        {
          "text": "[0,4,1,2,5,3]",
          "correct": false,
          "explanation": "The original-order pairs are [[2,1],[1,0],[0,0],[0,1],[1,1],[1,-1]]. Ranking their distinct sorted values gives [5,3,0,1,4,2]."
        }
      ]
    },
    {
      "id": "PRACTICE-B-20261103-Q10-0238",
      "topic": "Kasai — applied reasoning",
      "type": "single",
      "stem": "For text=\"abaabaabaabaabab\", let L be the adjacent LCP array with L[0]=0. Return [S,M], where S=sum(L) and M=max(L). S also counts successful equal-character comparisons if every adjacent pair is scanned independently from offset zero. Which pair is correct?",
      "options": [
        {
          "text": "[81,12]",
          "correct": true,
          "explanation": "The suffix array is [2,5,8,11,14,0,3,6,9,12,15,1,4,7,10,13] and LCP is [0,10,7,4,1,2,12,9,6,3,0,1,11,8,5,2]. Thus the sum is 81 and the longest-repeat length is 12. Reusing Kasai state avoids repeating these successful comparisons."
        },
        {
          "text": "[83,15]",
          "correct": false,
          "explanation": "The suffix array is [2,5,8,11,14,0,3,6,9,12,15,1,4,7,10,13] and LCP is [0,10,7,4,1,2,12,9,6,3,0,1,11,8,5,2]. Thus the sum is 81 and the longest-repeat length is 12. Reusing Kasai state avoids repeating these successful comparisons."
        },
        {
          "text": "[80,14]",
          "correct": false,
          "explanation": "The suffix array is [2,5,8,11,14,0,3,6,9,12,15,1,4,7,10,13] and LCP is [0,10,7,4,1,2,12,9,6,3,0,1,11,8,5,2]. Thus the sum is 81 and the longest-repeat length is 12. Reusing Kasai state avoids repeating these successful comparisons."
        },
        {
          "text": "[80,9]",
          "correct": false,
          "explanation": "The suffix array is [2,5,8,11,14,0,3,6,9,12,15,1,4,7,10,13] and LCP is [0,10,7,4,1,2,12,9,6,3,0,1,11,8,5,2]. Thus the sum is 81 and the longest-repeat length is 12. Reusing Kasai state avoids repeating these successful comparisons."
        }
      ]
    },
    {
      "id": "PRACTICE-B-20261103-Q11-0239",
      "topic": "LCS — applied reasoning",
      "type": "multiple",
      "stem": "For a=\"FGBEC\" and b=\"GFEBC\", select every output that satisfies BOTH the LCS value and reconstruction requirements.",
      "options": [
        {
          "text": "{\"length\":3,\"sequence\":\"GBC\"} is an accepted result.",
          "correct": true,
          "explanation": "The optimum length is 3; all optimal strings are [\"FBC\",\"FEC\",\"GBC\",\"GEC\"]. An accepted sequence must have the claimed length and preserve order in both inputs."
        },
        {
          "text": "{\"length\":3,\"sequence\":\"GBE\"} is an accepted result.",
          "correct": false,
          "explanation": "The optimum length is 3; all optimal strings are [\"FBC\",\"FEC\",\"GBC\",\"GEC\"]. An accepted sequence must have the claimed length and preserve order in both inputs."
        },
        {
          "text": "{\"length\":3,\"sequence\":\"GEB\"} is an accepted result.",
          "correct": false,
          "explanation": "The optimum length is 3; all optimal strings are [\"FBC\",\"FEC\",\"GBC\",\"GEC\"]. An accepted sequence must have the claimed length and preserve order in both inputs."
        },
        {
          "text": "{\"length\":3,\"sequence\":\"FEC\"} is an accepted result.",
          "correct": true,
          "explanation": "The optimum length is 3; all optimal strings are [\"FBC\",\"FEC\",\"GBC\",\"GEC\"]. An accepted sequence must have the claimed length and preserve order in both inputs."
        },
        {
          "text": "{\"length\":3,\"sequence\":\"FBC\"} is an accepted result.",
          "correct": true,
          "explanation": "The optimum length is 3; all optimal strings are [\"FBC\",\"FEC\",\"GBC\",\"GEC\"]. An accepted sequence must have the claimed length and preserve order in both inputs."
        }
      ]
    },
    {
      "id": "PRACTICE-B-20261103-Q12-0240",
      "topic": "Tree reconstruction — applied reasoning",
      "type": "multiple",
      "stem": "A tree has weights=[2,8,0,9,0,0] and edges=[[0,1],[0,2],[0,3],[0,4],[0,5]]. The empty set is allowed. Select every output that satisfies BOTH optimal weight and a valid reconstructed set.",
      "options": [
        {
          "text": "{\"weight\":17,\"selected\":[0,3,4]} is an accepted result.",
          "correct": false,
          "explanation": "The optimum is 17; all optimal sets are [[1,3],[1,2,3],[1,3,4],[1,2,3,4],[1,3,5],[1,2,3,5],[1,3,4,5],[1,2,3,4,5]]. Zero-weight leaves may be included when independent; a claimed total alone does not validate a set."
        },
        {
          "text": "{\"weight\":17,\"selected\":[1,3,5]} is an accepted result.",
          "correct": true,
          "explanation": "The optimum is 17; all optimal sets are [[1,3],[1,2,3],[1,3,4],[1,2,3,4],[1,3,5],[1,2,3,5],[1,3,4,5],[1,2,3,4,5]]. Zero-weight leaves may be included when independent; a claimed total alone does not validate a set."
        },
        {
          "text": "{\"weight\":17,\"selected\":[1,3,4]} is an accepted result.",
          "correct": true,
          "explanation": "The optimum is 17; all optimal sets are [[1,3],[1,2,3],[1,3,4],[1,2,3,4],[1,3,5],[1,2,3,5],[1,3,4,5],[1,2,3,4,5]]. Zero-weight leaves may be included when independent; a claimed total alone does not validate a set."
        },
        {
          "text": "{\"weight\":17,\"selected\":[0,2,5]} is an accepted result.",
          "correct": false,
          "explanation": "The optimum is 17; all optimal sets are [[1,3],[1,2,3],[1,3,4],[1,2,3,4],[1,3,5],[1,2,3,5],[1,3,4,5],[1,2,3,4,5]]. Zero-weight leaves may be included when independent; a claimed total alone does not validate a set."
        },
        {
          "text": "{\"weight\":17,\"selected\":[2,3,5]} is an accepted result.",
          "correct": false,
          "explanation": "The optimum is 17; all optimal sets are [[1,3],[1,2,3],[1,3,4],[1,2,3,4],[1,3,5],[1,2,3,5],[1,3,4,5],[1,2,3,4,5]]. Zero-weight leaves may be included when independent; a claimed total alone does not validate a set."
        }
      ]
    },
    {
      "id": "PRACTICE-B-20261103-Q13-0241",
      "topic": "Aho-Corasick — applied reasoning",
      "type": "multiple",
      "stem": "Aho–Corasick uses patterns=[\"a\",\"ba\",\"a\",\"aa\",\"baa\"] and text=\"baaabaaaaa\". Count overlaps, terminal suffixes and duplicate dictionary positions. Select all correct per-position counts.",
      "options": [
        {
          "text": "The count for dictionary position 1 (\"ba\") is 2.",
          "correct": true,
          "explanation": "The complete row is [8,2,8,6,2]. Duplicate strings retain separate columns; every terminal suffix also contributes."
        },
        {
          "text": "The count for dictionary position 0 (\"a\") is 9.",
          "correct": false,
          "explanation": "The complete row is [8,2,8,6,2]. Duplicate strings retain separate columns; every terminal suffix also contributes."
        },
        {
          "text": "The count for dictionary position 4 (\"baa\") is 2.",
          "correct": true,
          "explanation": "The complete row is [8,2,8,6,2]. Duplicate strings retain separate columns; every terminal suffix also contributes."
        },
        {
          "text": "The count for dictionary position 2 (\"a\") is 8.",
          "correct": true,
          "explanation": "The complete row is [8,2,8,6,2]. Duplicate strings retain separate columns; every terminal suffix also contributes."
        },
        {
          "text": "The count for dictionary position 3 (\"aa\") is 7.",
          "correct": false,
          "explanation": "The complete row is [8,2,8,6,2]. Duplicate strings retain separate columns; every terminal suffix also contributes."
        }
      ]
    },
    {
      "id": "PRACTICE-B-20261103-Q14-0242",
      "topic": "Aho-Corasick — applied reasoning",
      "type": "multiple",
      "stem": "One Aho automaton processes patterns=[\"bc\",\"c\",\"bc\"] and independent texts=[\"b\",\"c\",\"bc\",\"bcbc\",\"\"]. Rows follow text order; columns follow original dictionary positions. Select every correct row. State and counters reset for each text.",
      "options": [
        {
          "text": "The count row for text index 1 is [0,1,0].",
          "correct": true,
          "explanation": "The complete matrix is [[0,0,0],[0,1,0],[1,1,1],[2,2,2],[0,0,0]]. Matches cannot cross text boundaries. The empty text retains one zero for each dictionary position."
        },
        {
          "text": "The count row for text index 3 is [2,2,2].",
          "correct": true,
          "explanation": "The complete matrix is [[0,0,0],[0,1,0],[1,1,1],[2,2,2],[0,0,0]]. Matches cannot cross text boundaries. The empty text retains one zero for each dictionary position."
        },
        {
          "text": "The count row for text index 0 is [0,1,0].",
          "correct": false,
          "explanation": "The complete matrix is [[0,0,0],[0,1,0],[1,1,1],[2,2,2],[0,0,0]]. Matches cannot cross text boundaries. The empty text retains one zero for each dictionary position."
        },
        {
          "text": "The count row for text index 4 is [0,0,1].",
          "correct": false,
          "explanation": "The complete matrix is [[0,0,0],[0,1,0],[1,1,1],[2,2,2],[0,0,0]]. Matches cannot cross text boundaries. The empty text retains one zero for each dictionary position."
        },
        {
          "text": "The count row for text index 2 is [2,1,1].",
          "correct": false,
          "explanation": "The complete matrix is [[0,0,0],[0,1,0],[1,1,1],[2,2,2],[0,0,0]]. Matches cannot cross text boundaries. The empty text retains one zero for each dictionary position."
        }
      ]
    },
    {
      "id": "PRACTICE-B-20261103-Q15-0243",
      "topic": "Verification — applied reasoning",
      "type": "multiple",
      "stem": "Three measured times (microseconds) are naive=[70,32,74], KMP=[72,81,68] and exact RK=[74,42,46]. Outputs have been checked and timing boundaries match. Select every correct numerical conclusion; no claim about universal speed is implied.",
      "options": [
        {
          "text": "The number of overlapping matches of a repeated \"a\" pattern of length 3 in a text of 15 \"a\" characters is 13.",
          "correct": true,
          "explanation": "The three medians are [70,72,46]. Repeated-character matches occupy every legal start, giving 13; an empty pattern matches 16 boundaries. These measurements do not prove an asymptotic ranking."
        },
        {
          "text": "The median exact RK time in microseconds is 46.",
          "correct": true,
          "explanation": "The three medians are [70,72,46]. Repeated-character matches occupy every legal start, giving 13; an empty pattern matches 16 boundaries. These measurements do not prove an asymptotic ranking."
        },
        {
          "text": "The median KMP time in microseconds is 73.",
          "correct": false,
          "explanation": "The three medians are [70,72,46]. Repeated-character matches occupy every legal start, giving 13; an empty pattern matches 16 boundaries. These measurements do not prove an asymptotic ranking."
        },
        {
          "text": "The median naive time in microseconds is 70.",
          "correct": true,
          "explanation": "The three medians are [70,72,46]. Repeated-character matches occupy every legal start, giving 13; an empty pattern matches 16 boundaries. These measurements do not prove an asymptotic ranking."
        },
        {
          "text": "The number of starts for an empty pattern in a text of length 15 is 17.",
          "correct": false,
          "explanation": "The three medians are [70,72,46]. Repeated-character matches occupy every legal start, giving 13; an empty pattern matches 16 boundaries. These measurements do not prove an asymptotic ranking."
        }
      ]
    }
  ]
};
