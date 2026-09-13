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

# Build a complete modern interview-room shell and details.
remove_collection("TEAM4_INTERVIEW_ROOM")
collection = bpy.data.collections.new("TEAM4_INTERVIEW_ROOM")
bpy.context.scene.collection.children.link(collection)

wall_mat = material("TEAM4_Wall_WarmWhite", (0.72, 0.70, 0.66), roughness=0.82)
ceiling_mat = material("TEAM4_Ceiling", (0.88, 0.87, 0.83), roughness=0.88)
panel_mat = material("TEAM4_Acoustic_Dark", (0.035, 0.045, 0.055), roughness=0.90)
frame_mat = material("TEAM4_Frame_Black", (0.012, 0.014, 0.018), metallic=0.72, roughness=0.28)
pot_mat = material("TEAM4_Pot_Matte", (0.075, 0.082, 0.088), roughness=0.72)
green_mat = material("TEAM4_Plant_Green", (0.045, 0.18, 0.075), roughness=0.78)
paper_mat = material("TEAM4_Paper", (0.82, 0.80, 0.72), roughness=0.82)
screen_mat = material("TEAM4_Laptop_Screen", (0.018, 0.055, 0.085), metallic=0.10, roughness=0.22)

# Back wall, left wall, segmented right wall and ceiling.
rounded_cube("TEAM4_Back_Wall", (0, 3.38, 1.62), (4.18, 0.10, 1.62), wall_mat, 0.025)
rounded_cube("TEAM4_Left_Wall", (-4.18, 0.20, 1.62), (0.10, 3.18, 1.62), wall_mat, 0.025)
rounded_cube("TEAM4_Right_Wall_Back", (4.18, 1.65, 1.62), (0.10, 1.73, 1.62), wall_mat, 0.025)
rounded_cube("TEAM4_Right_Wall_Front", (4.18, -2.55, 1.62), (0.10, 0.63, 1.62), wall_mat, 0.025)
rounded_cube("TEAM4_Ceiling", (0, 0.20, 3.26), (4.18, 3.18, 0.08), ceiling_mat, 0.025)

# Glass entrance door in the right-side opening.
glass = bpy.data.materials.get("TEAM4_Glass") or bpy.data.materials.new("TEAM4_Glass")
glass.use_nodes = True
glass.diffuse_color = (0.15, 0.22, 0.26, 0.22)
gbsdf = glass.node_tree.nodes.get("Principled BSDF")
if gbsdf:
    gbsdf.inputs["Base Color"].default_value = (0.12, 0.19, 0.23, 1.0)
    gbsdf.inputs["Roughness"].default_value = 0.12
    if "Transmission Weight" in gbsdf.inputs:
        gbsdf.inputs["Transmission Weight"].default_value = 0.78
    elif "Transmission" in gbsdf.inputs:
        gbsdf.inputs["Transmission"].default_value = 0.78
    gbsdf.inputs["Alpha"].default_value = 0.28
glass.surface_render_method = "DITHERED"
rounded_cube("TEAM4_Glass_Door", (4.05, -0.92, 1.18), (0.035, 0.73, 1.18), glass, 0.018)
rounded_cube("TEAM4_Door_Frame_Top", (4.05, -0.92, 2.39), (0.055, 0.79, 0.045), frame_mat, 0.012)
rounded_cube("TEAM4_Door_Frame_Left", (4.05, -1.69, 1.18), (0.055, 0.045, 1.18), frame_mat, 0.012)
rounded_cube("TEAM4_Door_Frame_Right", (4.05, -0.15, 1.18), (0.055, 0.045, 1.18), frame_mat, 0.012)
handle = rounded_cube("TEAM4_Door_Handle", (3.96, -0.36, 1.12), (0.035, 0.16, 0.025), frame_mat, 0.018)

# Symmetrical acoustic panels leave the center free for the existing TEAM4 logo.
for i, x in enumerate((-2.70, -2.15, 2.15, 2.70), 1):
    rounded_cube(f"TEAM4_Acoustic_Panel_{i}", (x, 3.245, 1.83), (0.20, 0.035, 0.78), panel_mat, 0.035)

# Low side cabinet.
rounded_cube("TEAM4_Sideboard", (-3.30, 2.64, 0.48), (0.62, 0.34, 0.46), frame_mat, 0.055)
rounded_cube("TEAM4_Sideboard_Top", (-3.30, 2.64, 0.97), (0.66, 0.37, 0.045), wood, 0.025)

# Potted plant with a compact leafy crown.
bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.30, depth=0.48, location=(-3.30, 2.62, 1.25))
pot = bpy.context.object
pot.name = "TEAM4_Plant_Pot"
pot.data.materials.append(pot_mat)
for old_collection in list(pot.users_collection):
    old_collection.objects.unlink(pot)
collection.objects.link(pot)
bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.055, depth=0.80, location=(-3.30, 2.62, 1.84))
stem = bpy.context.object
stem.name = "TEAM4_Plant_Stem"
stem.data.materials.append(green_mat)
for old_collection in list(stem.users_collection):
    old_collection.objects.unlink(stem)
collection.objects.link(stem)
for i, (dx, dy, dz, sx, sy) in enumerate((
    (-0.25,0.00,2.03,0.30,0.13), (0.24,0.03,2.08,0.30,0.13),
    (-0.12,-0.04,2.28,0.27,0.12), (0.14,0.02,2.35,0.27,0.12),
    (0.00,0.00,2.53,0.24,0.11),
), 1):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=12, location=(-3.30+dx, 2.62+dy, dz))
    leaf = bpy.context.object
    leaf.name = f"TEAM4_Plant_Leaf_{i}"
    leaf.scale = (sx, sy, 0.10)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    leaf.data.materials.append(green_mat)
    for old_collection in list(leaf.users_collection):
        old_collection.objects.unlink(leaf)
    collection.objects.link(leaf)

# Interview props: laptop, folder, pen and water glasses.
rounded_cube("TEAM4_Laptop_Base", (0.72, 0.08, 1.50), (0.34, 0.25, 0.025), frame_mat, 0.025)
laptop_screen = rounded_cube("TEAM4_Laptop_Screen", (0.91, 0.08, 1.74), (0.025, 0.25, 0.23), screen_mat, 0.018)
laptop_screen.rotation_euler.y = math.radians(-8)
rounded_cube("TEAM4_Document_Folder", (-0.38, -0.08, 1.49), (0.28, 0.20, 0.018), paper_mat, 0.018)
rounded_cube("TEAM4_Pen", (-0.36, -0.34, 1.51), (0.17, 0.018, 0.018), frame_mat, 0.012)
for i, x in enumerate((-1.05, 1.25), 1):
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.065, depth=0.18, location=(x, -0.30, 1.55))
    glass_obj = bpy.context.object
    glass_obj.name = f"TEAM4_Water_Glass_{i}"
    glass_obj.data.materials.append(glass)
    for old_collection in list(glass_obj.users_collection):
        old_collection.objects.unlink(glass_obj)
    collection.objects.link(glass_obj)

# Soft warm ceiling lights.
for i, x in enumerate((-1.55, 1.55), 1):
    rounded_cube(f"TEAM4_Ceiling_Panel_{i}", (x, 0.20, 3.16), (0.72, 0.32, 0.025), ceiling_mat, 0.025)
    light_data = bpy.data.lights.new(f"TEAM4_Soft_Light_{i}", type="AREA")
    light_data.energy = 420
    light_data.color = (1.0, 0.82, 0.66)
    light_data.shape = "RECTANGLE"
    light_data.size = 1.45
    light_data.size_y = 0.64
    light_obj = bpy.data.objects.new(f"TEAM4_Soft_Light_{i}", light_data)
    collection.objects.link(light_obj)
    light_obj.location = (x, 0.20, 3.08)
    light_obj.rotation_euler = (0, 0, 0)

# Rebuild the interview room with a higher ceiling.
remove_collection("TEAM4_INTERVIEW_ROOM")
collection = bpy.data.collections.new("TEAM4_INTERVIEW_ROOM")
bpy.context.scene.collection.children.link(collection)

wall_mat = material("TEAM4_Wall_WarmWhite", (0.72, 0.70, 0.66), roughness=0.82)
ceiling_mat = material("TEAM4_Ceiling", (0.88, 0.87, 0.83), roughness=0.88)
panel_mat = material("TEAM4_Acoustic_Dark", (0.035, 0.045, 0.055), roughness=0.90)
frame_mat = material("TEAM4_Frame_Black", (0.012, 0.014, 0.018), metallic=0.72, roughness=0.28)
pot_mat = material("TEAM4_Pot_Matte", (0.075, 0.082, 0.088), roughness=0.72)
green_mat = material("TEAM4_Plant_Green", (0.045, 0.18, 0.075), roughness=0.78)
paper_mat = material("TEAM4_Paper", (0.82, 0.80, 0.72), roughness=0.82)
screen_mat = material("TEAM4_Laptop_Screen", (0.018, 0.055, 0.085), metallic=0.10, roughness=0.22)

# 4.2-metre-high room shell.
rounded_cube("TEAM4_Back_Wall", (0, 3.38, 2.10), (4.18, 0.10, 2.10), wall_mat, 0.025)
rounded_cube("TEAM4_Left_Wall", (-4.18, 0.20, 2.10), (0.10, 3.18, 2.10), wall_mat, 0.025)
rounded_cube("TEAM4_Right_Wall_Back", (4.18, 1.65, 2.10), (0.10, 1.73, 2.10), wall_mat, 0.025)
rounded_cube("TEAM4_Right_Wall_Front", (4.18, -2.55, 2.10), (0.10, 0.63, 2.10), wall_mat, 0.025)
rounded_cube("TEAM4_Ceiling", (0, 0.20, 4.22), (4.18, 3.18, 0.08), ceiling_mat, 0.025)

# Glass entrance.
glass = bpy.data.materials.get("TEAM4_Glass") or bpy.data.materials.new("TEAM4_Glass")
glass.use_nodes = True
glass.diffuse_color = (0.15, 0.22, 0.26, 0.22)
gbsdf = glass.node_tree.nodes.get("Principled BSDF")
if gbsdf:
    gbsdf.inputs["Base Color"].default_value = (0.12, 0.19, 0.23, 1.0)
    gbsdf.inputs["Roughness"].default_value = 0.12
    transmission = gbsdf.inputs.get("Transmission Weight") or gbsdf.inputs.get("Transmission")
    if transmission:
        transmission.default_value = 0.78
    gbsdf.inputs["Alpha"].default_value = 0.28
if hasattr(glass, "surface_render_method"):
    glass.surface_render_method = "DITHERED"
rounded_cube("TEAM4_Glass_Door", (4.05, -0.92, 1.18), (0.035, 0.73, 1.18), glass, 0.018)
rounded_cube("TEAM4_Door_Frame_Top", (4.05, -0.92, 2.39), (0.055, 0.79, 0.045), frame_mat, 0.012)
rounded_cube("TEAM4_Door_Frame_Left", (4.05, -1.69, 1.18), (0.055, 0.045, 1.18), frame_mat, 0.012)
rounded_cube("TEAM4_Door_Frame_Right", (4.05, -0.15, 1.18), (0.055, 0.045, 1.18), frame_mat, 0.012)
rounded_cube("TEAM4_Door_Handle", (3.96, -0.36, 1.12), (0.035, 0.16, 0.025), frame_mat, 0.018)

# Acoustic panels around the central logo area.
for i, x in enumerate((-2.75, -2.25, 2.25, 2.75), 1):
    rounded_cube(f"TEAM4_Acoustic_Panel_{i}", (x, 3.245, 2.25), (0.18, 0.035, 0.72), panel_mat, 0.035)

# Dark feature plaque makes the colorful logo readable from across the room.
rounded_cube("TEAM4_Logo_Backplate", (0, 3.255, 2.55), (1.78, 0.025, 0.92), panel_mat, 0.07)

# TEAM4 logo image plane on the middle of the back wall.
logo_path = bpy.path.abspath(str((__import__("pathlib").Path(__file__).parents[3] / "assets" / "team4-logo-hero.webp")))
if __import__("pathlib").Path(logo_path).is_file():
    mesh = bpy.data.meshes.new("TEAM4_Logo_Mesh")
    mesh.from_pydata(
        [(-1.25, 0, -0.72), (1.25, 0, -0.72), (1.25, 0, 0.72), (-1.25, 0, 0.72)],
        [],
        [(0, 1, 2, 3)],
    )
    mesh.update()
    uv_layer = mesh.uv_layers.new(name="UVMap")
    for loop, uv in zip(uv_layer.data, ((0,0), (1,0), (1,1), (0,1))):
        loop.uv = uv
    logo = bpy.data.objects.new("TEAM4_Wall_Logo", mesh)
    logo.location = (0, 3.215, 2.55)
    logo.scale = (2.65, 1.0, 2.65)
    collection.objects.link(logo)
    logo_mat = bpy.data.materials.get("TEAM4_Logo_Material") or bpy.data.materials.new("TEAM4_Logo_Material")
    logo_mat.use_nodes = True
    nodes = logo_mat.node_tree.nodes
    links = logo_mat.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    tex = nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(logo_path, check_existing=True)
    links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    links.new(tex.outputs["Alpha"], bsdf.inputs["Alpha"])
    links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    bsdf.inputs["Roughness"].default_value = 0.34
    if hasattr(logo_mat, "surface_render_method"):
        logo_mat.surface_render_method = "DITHERED"
    logo.data.materials.append(logo_mat)

# Sideboard and plant.
rounded_cube("TEAM4_Sideboard", (-3.30, 2.64, 0.48), (0.62, 0.34, 0.46), frame_mat, 0.055)
rounded_cube("TEAM4_Sideboard_Top", (-3.30, 2.64, 0.97), (0.66, 0.37, 0.045), wood, 0.025)
bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.30, depth=0.48, location=(-3.30, 2.62, 1.25))
pot = bpy.context.object
pot.name = "TEAM4_Plant_Pot"
pot.data.materials.append(pot_mat)
for old_collection in list(pot.users_collection):
    old_collection.objects.unlink(pot)
collection.objects.link(pot)
bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.055, depth=0.80, location=(-3.30, 2.62, 1.84))
stem = bpy.context.object
stem.name = "TEAM4_Plant_Stem"
stem.data.materials.append(green_mat)
for old_collection in list(stem.users_collection):
    old_collection.objects.unlink(stem)
collection.objects.link(stem)
for i, (dx, dy, dz, sx, sy) in enumerate(((-0.25,0,2.03,.30,.13),(.24,.03,2.08,.30,.13),(-.12,-.04,2.28,.27,.12),(.14,.02,2.35,.27,.12),(0,0,2.53,.24,.11)), 1):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=12, location=(-3.30+dx, 2.62+dy, dz))
    leaf = bpy.context.object
    leaf.name = f"TEAM4_Plant_Leaf_{i}"
    leaf.scale = (sx, sy, .10)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    leaf.data.materials.append(green_mat)
    for old_collection in list(leaf.users_collection):
        old_collection.objects.unlink(leaf)
    collection.objects.link(leaf)

# Laptop moved to the left edge of the table, plus interview stationery.
rounded_cube("TEAM4_Laptop_Base", (-1.12, 0.08, 1.50), (0.34, 0.25, 0.025), frame_mat, 0.025)
laptop_screen = rounded_cube("TEAM4_Laptop_Screen", (-0.91, 0.08, 1.74), (0.025, 0.25, 0.23), screen_mat, 0.018)
laptop_screen.rotation_euler.y = math.radians(-8)
rounded_cube("TEAM4_Document_Folder", (-0.25, -0.08, 1.49), (0.28, 0.20, 0.018), paper_mat, 0.018)
rounded_cube("TEAM4_Pen", (-0.20, -0.34, 1.51), (0.17, 0.018, 0.018), frame_mat, 0.012)

# Higher ceiling lights.
light_panel_mat = material("TEAM4_Light_Panel", (0.92, 0.88, 0.76), roughness=0.22)
for i, x in enumerate((-1.55, 1.55), 1):
    rounded_cube(f"TEAM4_Ceiling_Panel_{i}", (x, 0.15, 4.11), (0.62, 0.38, 0.025), light_panel_mat, 0.018)
    data = bpy.data.lights.new(f"TEAM4_Area_Light_{i}", "AREA")
    data.energy = 520
    data.color = (1.0, 0.86, 0.68)
    data.shape = "RECTANGLE"
    data.size = 1.25
    obj = bpy.data.objects.new(f"TEAM4_Area_Light_{i}", data)
    obj.location = (x, 0.15, 4.02)
    collection.objects.link(obj)

bpy.ops.object.select_all(action="DESELECT")
left.select_set(True)
right.select_set(True)
bpy.context.view_layer.objects.active = left
bpy.context.scene["team4_last_command"] = "complete_interview_room_v8"
print("Team4: armchairs positioned at the table ends and turned toward the table.")
