"""Team4 Bridge command file.

Codex will replace this file with the next approved Blender scene command.
Use Blender's Team4 > Sync & Run button to execute it.
"""

import bpy

scene = bpy.context.scene
scene["team4_bridge_ready"] = True
print("Team4 Bridge is connected and ready.")
