---
title: "Git Cheatsheet"
description: "Quick access to essential git commands."
date: "01/25/25"
tags:
  - git
  - rebase
---

## Pulling

Let’s say John and you (or more ppl) are working on the same branch.

1. **[SITUATION 1]** You have some changes and John pushes. Now your local git is one commit behind. i.e `↓ 1`
   1. Try `git pull` to catch up your current branch. If successful, you’re done!
   2. If get `Fatal: Not possible to fast-forward, aborting` move on to SITUATION 2.
2. **[SITUATION 2]** Let’s say you already have multiple commits and John pushes. Now your local repo looks like `↓ 1 ↑ 3`
   1. Use `git pull --rebase`. Think of this as putting your changes aside, pulling all the pushed changes from remote and then popping you changes on top of that. This may cause merge conflicts if John’s changed files that you also changed.
   2. If you run into `Fatal: Not possible to fast-forward, aborting` again, you may have pending changes that you haven’t committed. Try `git stash` to stash your changes, `git pull --rebase` to pull John’s commit, `git stash pop` to add your changes back.

---

## Undo Commits

We will refer to mistake commit(s) as the commits that you want to undo

1. **[SITUATION 1]** You haven’t yet pushed your mistake commit(s) to the remote repo
   1. Undo last commit: `git reset HEAD~`
   2. Undo last n commits: `git reset HEAD~n` i.e `git reset HEAD~4`
2. **[SITUATION 2]** You pushed your mistake commits, your mistake commits are on top of all the other commits, and you want to wipe your mistake commits from the history.
   1. `git reset HEAD~` OR `git reset HEAD~n` and then `git push --force`
   2. Ensure you are on the correct branch and your local branch and remote branch are caught up.

---

## Catching Up Your Branch

You’re writing a feature or fix branch and now main branch has changes that aren’t in your branch. Continue to next step if current step fails or is too difficult.

1. **[Step 1]** Attempt to rebase changes from main into your feature branch

```bash
git checkout feature      # gets you "on branch feature"
git fetch origin          # gets you up to date with origin
git pull --rebase main    # puts your changes on top of main's changes
```

2. **[Step 2]** Just squash merge changes into your branch

```bash
git checkout feature      # gets you "on branch feature"
git fetch origin          # gets you up to date with origin
git merge origin/main
```
