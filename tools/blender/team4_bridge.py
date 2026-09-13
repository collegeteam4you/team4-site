bl_info = {
    "name": "Team4 Bridge",
    "author": "Team4",
    "version": (1, 0, 0),
    "blender": (4, 0, 0),
    "location": "View3D > Sidebar > Team4",
    "description": "Run Team4 scene commands and export selected assets to GLB",
    "category": "Development",
}

import bpy
from pathlib import Path
import traceback


def default_repo_root():
    return str(Path.home() / "Documents" / "GitHub" / "team4-site")


class TEAM4_PG_Settings(bpy.types.PropertyGroup):
    repo_root: bpy.props.StringProperty(
        name="Project folder",
        subtype="DIR_PATH",
        default=default_repo_root(),
    )
    command_file: bpy.props.StringProperty(
        name="Command file",
        default="tools/blender/commands/current.py",
    )
    export_file: bpy.props.StringProperty(
        name="GLB output",
        default="assets/team4-lab/models/team4_scene.glb",
    )


class TEAM4_OT_RunCommand(bpy.types.Operator):
    bl_idname = "team4.run_command"
    bl_label = "Sync & Run"
    bl_description = "Run the current Team4 Blender command"

    def execute(self, context):
        settings = context.scene.team4_bridge
        script = Path(bpy.path.abspath(settings.repo_root)) / settings.command_file
        if not script.is_file():
            self.report({"ERROR"}, f"Command not found: {script}")
            return {"CANCELLED"}
        try:
            code = compile(script.read_text(encoding="utf-8"), str(script), "exec")
            namespace = {"bpy": bpy, "__file__": str(script), "__name__": "__main__"}
            exec(code, namespace)
            self.report({"INFO"}, "Team4 command completed")
            return {"FINISHED"}
        except Exception:
            traceback.print_exc()
            self.report({"ERROR"}, "Command failed. See System Console")
            return {"CANCELLED"}


class TEAM4_OT_ExportGLB(bpy.types.Operator):
    bl_idname = "team4.export_glb"
    bl_label = "Export GLB"
    bl_description = "Export the scene for the Team4 Three.js game"

    def execute(self, context):
        settings = context.scene.team4_bridge
        output = Path(bpy.path.abspath(settings.repo_root)) / settings.export_file
        output.parent.mkdir(parents=True, exist_ok=True)
        try:
            bpy.ops.export_scene.gltf(
                filepath=str(output),
                export_format="GLB",
                use_selection=False,
                export_apply=True,
            )
            self.report({"INFO"}, f"Exported: {output.name}")
            return {"FINISHED"}
        except Exception:
            traceback.print_exc()
            self.report({"ERROR"}, "Export failed. See System Console")
            return {"CANCELLED"}


class TEAM4_PT_Bridge(bpy.types.Panel):
    bl_label = "Team4 Bridge"
    bl_idname = "TEAM4_PT_bridge"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "Team4"

    def draw(self, context):
        layout = self.layout
        settings = context.scene.team4_bridge
        layout.prop(settings, "repo_root")
        layout.prop(settings, "command_file")
        layout.operator("team4.run_command", icon="PLAY")
        layout.separator()
        layout.prop(settings, "export_file")
        layout.operator("team4.export_glb", icon="EXPORT")


classes = (
    TEAM4_PG_Settings,
    TEAM4_OT_RunCommand,
    TEAM4_OT_ExportGLB,
    TEAM4_PT_Bridge,
)


def register():
    for cls in classes:
        bpy.utils.register_class(cls)
    bpy.types.Scene.team4_bridge = bpy.props.PointerProperty(type=TEAM4_PG_Settings)


def unregister():
    del bpy.types.Scene.team4_bridge
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)


if __name__ == "__main__":
    register()
