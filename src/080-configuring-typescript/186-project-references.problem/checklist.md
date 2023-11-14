1. Add a `tsconfig.json` file to the root of the exercise folder.
2. Add `"files": []` to the `tsconfig.json`.
3. Add a `"references"` field to the `tsconfig.json` which references the `client` and `server` `tsconfig.json` files.
4. Investigate the `"composite": true` field, and figure out how to add it to `client` and `server`.
5. Investigate what `tsc -b` does, and figure out whether you need to add it anywhere.
