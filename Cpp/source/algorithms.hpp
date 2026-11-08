#pragma once
#include "json.hpp"
// Compare two versions of a sequence while preserving the order of shared characters. Implement lcs according to docs/guide/CONTRACTS.md.
inline J lcs(const J& input){throw runtime_error("TODO lcs");}

// Plan the cheapest sequence of adjacent block merges when the original order must be preserved. Implement merge according to docs/guide/CONTRACTS.md.
inline J merge(const J& input){throw runtime_error("TODO merge");}

// Choose a maximum-value set when neighbouring vertices are incompatible and conflicts form a tree. Implement tree according to docs/guide/CONTRACTS.md.
inline J tree(const J& input){throw runtime_error("TODO tree");}

// Establish a simple exact-search baseline against which the other two searches can be checked. Implement naive according to docs/guide/CONTRACTS.md.
inline J naive(const J& input){throw runtime_error("TODO naive");}

// Reuse information about matched prefixes to avoid restarting the search after every mismatch. Implement kmp according to docs/guide/CONTRACTS.md.
inline J kmp(const J& input){throw runtime_error("TODO kmp");}

// Reject windows with unequal fingerprints and verify every equal-hash candidate. Implement rk according to docs/guide/CONTRACTS.md.
inline J rk(const J& input){throw runtime_error("TODO rk");}

// Order the text suffixes and use adjacent common prefixes to find repeated substrings. Implement suffix according to docs/guide/CONTRACTS.md.
inline J suffix(const J& input){throw runtime_error("TODO suffix");}

// Build one dictionary automaton and count its patterns in several independent texts. Implement aho according to docs/guide/CONTRACTS.md.
inline J aho(const J& input){throw runtime_error("TODO aho");}
