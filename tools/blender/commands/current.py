"""Refine and position two realistic interview armchairs.

Idempotent: rerunning replaces only Team4-generated armchairs.
"""

import bpy
import math

COLLECTION_NAME = "TEAM4_REALISTIC_ARMCHAIRS"


def remove_collection(name):
    old = bpy.data.collections.get(name)
    if not old:
        return
    for obj in list(old.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.collections.remove(old)


def hide_named_old_chairs():
    keywords = ("chair", "armchair", "seat", "სკამ", "სავარძ")
    for obj in bpy.context.scene.objects:
        name = obj.name.lower()
        if not name.startswith("team4_") and any(word in name for word in keywords):
            obj.hide_viewport = True
            obj.hide_render = True
            obj["team4_hidden_old_chair"] = True


def material(name, color, metallic=0.0, roughness=0.5):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1.0)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (*color, 1.0)
        bsdf.inputs["Metallic"].default_value = metallic
        bsdf.inputs["Roughness"].default_value = roughness
    return mat


def rounded_cube(name, location, scale, mat, bevel):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = obj.modifiers.new("Soft upholstery", "BEVEL")
    mod.width = bevel
    mod.segments = 5
    obj.data.materials.append(mat)
    for old_collection in list(obj.users_collection):
        old_collection.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


def leg(name, location, mat):
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.05, depth=0.48, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    for old_collection in list(obj.users_collection):
        old_collection.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


def create_armchair(prefix, x, y, turn):
    fabric = material("TEAM4_Fabric_Charcoal", (0.025, 0.032, 0.042), roughness=0.88)
    cushion = material("TEAM4_Cushion_Soft", (0.075, 0.085, 0.10), roughness=0.76)
    metal = material("TEAM4_Metal_Black", (0.012, 0.014, 0.018), metallic=0.82, roughness=0.22)

    root = bpy.data.objects.new(prefix, None)
    collection.objects.link(root)
    root.location = (x, y, 0)
    root.rotation_euler.z = math.radians(turn)

    local_parts = [
        ("SeatBase", (0, 0.10, 0.67), (0.74, 0.67, 0.17), fabric, 0.14),
        ("SeatCushion", (0, -0.03, 0.89), (0.62, 0.54, 0.15), cushion, 0.17),
        ("Back", (0, 0.56, 1.51), (0.70, 0.17, 0.67), fabric, 0.19),
        ("BackCushion", (0, 0.35, 1.48), (0.57, 0.13, 0.51), cushion, 0.15),
        ("Arm_L", (-0.70, 0.08, 1.06), (0.14, 0.61, 0.31), fabric, 0.14),
        ("Arm_R", (0.70, 0.08, 1.06), (0.14, 0.61, 0.31), fabric, 0.14),
    ]

    parts = []
    for suffix, location, scale, mat, bevel in local_parts:
        obj = rounded_cube(prefix+"_"+suffix, location, scale, mat, bevel)
        obj.parent = root
        parts.append(obj)

    parts[2].rotation_euler.x = math.radians(-7)

    for index, (dx, dy) in enumerate(((-0.54,-0.43),(0.54,-0.43),(-0.54,0.42),(0.54,0.42)), 1):
        obj = leg(prefix+f"_Leg_{index}", (dx, 0.10+dy, 0.33), metal)
        obj.rotation_euler.y = math.radians(7 if dx < 0 else -7)
        obj.parent = root
        parts.append(obj)

    for obj in parts:
        obj["team4_asset"] = "interview_armchair"
    root["team4_asset"] = "interview_armchair"
    return root


hide_named_old_chairs()
remove_collection(COLLECTION_NAME)
collection = bpy.data.collections.new(COLLECTION_NAME)
bpy.context.scene.collection.children.link(collection)

# Positioned at opposite ends of the table, facing each other across it.
left = create_armchair("TEAM4_Armchair_Left", -2.82, 0.10, 90)
right = create_armchair("TEAM4_Armchair_Right", 2.82, 0.10, -90)

# Replace the generated table on every run.
remove_collection("TEAM4_REALISTIC_TABLE")
collection = bpy.data.collections.new("TEAM4_REALISTIC_TABLE")
bpy.context.scene.collection.children.link(collection)

wood = material("TEAM4_Walnut_Wood", (0.20, 0.075, 0.035), roughness=0.38)
edge = material("TEAM4_Walnut_Edge", (0.09, 0.025, 0.012), roughness=0.30)
table_metal = material("TEAM4_Table_Metal", (0.012, 0.014, 0.018), metallic=0.88, roughness=0.20)

# Warm walnut top with softly rounded edges.
top = rounded_cube("TEAM4_Table_Top", (0, 0.10, 1.36), (1.62, 0.66, 0.10), wood, 0.09)
top["team4_asset"] = "interview_table"
apron = rounded_cube("TEAM4_Table_Apron", (0, 0.10, 1.20), (1.43, 0.53, 0.08), edge, 0.035)
apron["team4_asset"] = "interview_table"

# Slim, sturdy powder-coated metal legs.
for index, (x, y) in enumerate(((-1.30,-0.46), (1.30,-0.46), (-1.30,0.66), (1.30,0.66)), 1):
    table_leg = rounded_cube(
        f"TEAM4_Table_Leg_{index}",
        (x, y, 0.66),
        (0.075, 0.075, 0.60),
        table_metal,
        0.025,
    )
    table_leg["team4_asset"] = "interview_table"

# Add a room-size carpet while preserving the existing dark floor color.
remove_collection("TEAM4_CARPET_FLOOR")
collection = bpy.data.collections.new("TEAM4_CARPET_FLOOR")
bpy.context.scene.collection.children.link(collection)

carpet_mat = bpy.data.materials.get("TEAM4_Carpet_Charcoal") or bpy.data.materials.new("TEAM4_Carpet_Charcoal")
carpet_mat.use_nodes = True
nodes = carpet_mat.node_tree.nodes
links = carpet_mat.node_tree.links
for node in list(nodes):
    nodes.remove(node)
output = nodes.new("ShaderNodeOutputMaterial")
bsdf = nodes.new("ShaderNodeBsdfPrincipled")
noise = nodes.new("ShaderNodeTexNoise")
bump = nodes.new("ShaderNodeBump")
noise.inputs["Scale"].default_value = 145.0
noise.inputs["Detail"].default_value = 3.0
noise.inputs["Roughness"].default_value = 0.78
bump.inputs["Strength"].default_value = 0.22
bump.inputs["Distance"].default_value = 0.035
bsdf.inputs["Base Color"].default_value = (0.055, 0.070, 0.082, 1.0)
bsdf.inputs["Roughness"].default_value = 0.94
links.new(noise.outputs["Fac"], bump.inputs["Height"])
links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
carpet_mat.diffuse_color = (0.055, 0.070, 0.082, 1.0)

carpet = rounded_cube(
    "TEAM4_Room_Carpet",
    (0, 0.35, 0.035),
    (4.05, 3.05, 0.035),
    carpet_mat,
    0.055,
)
carpet["team4_asset"] = "interview_room_carpet"

bpy.ops.object.select_all(action="DESELECT")
left.select_set(True)
right.select_set(True)
bpy.context.view_layer.objects.active = left
bpy.context.scene["team4_last_command"] = "realistic_interview_furniture_v6_carpet"
print("Team4: armchairs positioned at the table ends and turned toward the table.")
