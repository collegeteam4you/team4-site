# Team4 Blender Bridge

This bridge connects Blender scene work with the `team4-lab-test` branch.

## Install once

1. In GitHub Desktop, select `team4-lab-test` and pull the latest changes.
2. In Blender open **Edit > Preferences > Add-ons > Install from Disk**.
3. Select `tools/blender/team4_bridge.py`.
4. Enable **Team4 Bridge**.
5. In the 3D View press **N** and open the **Team4** tab.

The default project folder is:

`C:\\Users\\User\\Documents\\GitHub\\team4-site`

## Workflow

1. Describe the requested 3D change in ChatGPT.
2. Codex updates `tools/blender/commands/current.py` on `team4-lab-test`.
3. Pull the change in GitHub Desktop.
4. In Blender click **Sync & Run**.
5. Review/save the Blender file.
6. Click **Export GLB** when the asset is ready for the Three.js game.

Exports go to `assets/team4-lab/models/team4_scene.glb` by default.
