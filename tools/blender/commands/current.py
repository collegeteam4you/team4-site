import bpy
import math
from mathutils import Vector

# TEAM4 modular semi-realistic character v2
COLLECTION_NAME = "TEAM4_CHARACTER_V2"
ROOT_NAME = "TEAM4_Character_Root"
SPAWN = bpy.context.scene.cursor.location.copy()
SPAWN.z = 0.0

def remove_collection(name):
    col = bpy.data.collections.get(name)
    if not col:
        return
    for obj in list(col.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.collections.remove(col)

remove_collection(COLLECTION_NAME)
col = bpy.data.collections.new(COLLECTION_NAME)
bpy.context.scene.collection.children.link(col)

def move_to_collection(obj):
    for owner in list(obj.users_collection):
        owner.objects.unlink(obj)
    col.objects.link(obj)

def mat(name, color, metallic=0.0, rough=0.5):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1.0)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metallic
    return m

SKIN = mat("T4_Skin_Warm", (0.54, 0.25, 0.14), 0.0, 0.48)
SKIN_LIGHT = mat("T4_Skin_Highlight", (0.72, 0.39, 0.24), 0.0, 0.45)
WHITE = mat("T4_Eye_White", (0.92, 0.92, 0.88), 0.0, 0.25)
IRIS = mat("T4_Iris_Brown", (0.08, 0.035, 0.012), 0.0, 0.2)
HAIR = mat("T4_Hair_Dark", (0.012, 0.008, 0.006), 0.0, 0.7)
SHIRT = mat("T4_Shirt_White", (0.72, 0.76, 0.78), 0.0, 0.62)
JACKET = mat("T4_Jacket_Charcoal", (0.025, 0.035, 0.05), 0.0, 0.38)
TROUSER = mat("T4_Trouser", (0.035, 0.045, 0.065), 0.0, 0.55)
SHOE = mat("T4_Shoe_Leather", (0.018, 0.012, 0.01), 0.05, 0.32)
METAL = mat("T4_Accessory_Metal", (0.18, 0.2, 0.22), 0.8, 0.2)
LOGO = mat("T4_Accent_Red", (0.72, 0.015, 0.01), 0.0, 0.36)

def finish(obj, name, material, smooth=True):
    obj.name = name
    move_to_collection(obj)
    if material:
        obj.data.materials.append(material)
    if smooth and obj.type == 'MESH':
        for p in obj.data.polygons:
            p.use_smooth = True
    return obj

def uv(name, loc, scale, material, seg=40, rings=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, location=SPAWN + Vector(loc))
    o = finish(bpy.context.object, name, material)
    o.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bev = o.modifiers.new("Micro_Bevel", 'BEVEL')
    bev.width = 0.008
    bev.segments = 2
    return o

def cube(name, loc, scale, material, bevel=0.08):
    bpy.ops.mesh.primitive_cube_add(location=SPAWN + Vector(loc))
    o = finish(bpy.context.object, name, material)
    o.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    b = o.modifiers.new("Soft_Edges", 'BEVEL')
    b.width = bevel
    b.segments = 4
    return o

def cyl(name, loc, radius, depth, material, rotation=(0,0,0), verts=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius, depth=depth, location=SPAWN + Vector(loc), rotation=rotation)
    o = finish(bpy.context.object, name, material)
    b = o.modifiers.new("Edge_Soften", 'BEVEL')
    b.width = 0.025
    b.segments = 3
    for p in o.data.polygons:
        p.use_smooth = True
    return o

def parent_bone(obj, arm, bone):
    world = obj.matrix_world.copy()
    obj.parent = arm
    obj.parent_type = 'BONE'
    obj.parent_bone = bone
    obj.matrix_world = world
    obj["team4_slot"] = bone

# Armature
bpy.ops.object.armature_add(enter_editmode=True, location=SPAWN)
arm = bpy.context.object
arm.name = "TEAM4_Rig"
move_to_collection(arm)
arm.show_in_front = True
arm.data.display_type = 'STICK'
for b in list(arm.data.edit_bones):
    arm.data.edit_bones.remove(b)

def bone(name, head, tail, parent=None):
    b = arm.data.edit_bones.new(name)
    b.head = Vector(head)
    b.tail = Vector(tail)
    if parent:
        b.parent = arm.data.edit_bones.get(parent)
    return b

bone("root", (0,0,0.05), (0,0,0.25))
bone("pelvis", (0,0,0.88), (0,0,1.05), "root")
bone("spine", (0,0,1.02), (0,0,1.34), "pelvis")
bone("chest", (0,0,1.30), (0,0,1.57), "spine")
bone("neck", (0,0,1.54), (0,0,1.70), "chest")
bone("head", (0,0,1.68), (0,0,1.94), "neck")
bone("upper_arm.L", (0.18,0,1.49), (0.48,0,1.37), "chest")
bone("forearm.L", (0.48,0,1.37), (0.70,0,1.14), "upper_arm.L")
bone("hand.L", (0.70,0,1.14), (0.77,0,1.04), "forearm.L")
bone("upper_arm.R", (-0.18,0,1.49), (-0.48,0,1.37), "chest")
bone("forearm.R", (-0.48,0,1.37), (-0.70,0,1.14), "upper_arm.R")
bone("hand.R", (-0.70,0,1.14), (-0.77,0,1.04), "forearm.R")
bone("thigh.L", (0.13,0,0.94), (0.15,0,0.53), "pelvis")
bone("shin.L", (0.15,0,0.53), (0.15,0,0.13), "thigh.L")
bone("foot.L", (0.15,0,0.13), (0.15,-0.20,0.07), "shin.L")
bone("thigh.R", (-0.13,0,0.94), (-0.15,0,0.53), "pelvis")
bone("shin.R", (-0.15,0,0.53), (-0.15,0,0.13), "thigh.R")
bone("foot.R", (-0.15,0,0.13), (-0.15,-0.20,0.07), "shin.R")
bpy.ops.object.mode_set(mode='OBJECT')

# Anatomical base and wardrobe. Front is -Y.
parts = []
parts += [(uv("T4_Head", (0,-0.012,1.79), (0.145,0.125,0.185), SKIN_LIGHT), "head")]
parts += [(uv("T4_Neck", (0,0,1.59), (0.075,0.07,0.105), SKIN), "neck")]
parts += [(uv("T4_Torso", (0,0,1.32), (0.265,0.135,0.34), SHIRT), "chest")]
parts += [(uv("T4_Pelvis", (0,0,0.98), (0.225,0.13,0.19), TROUSER), "pelvis")]

for side, sx in (("L",1),("R",-1)):
    parts += [(uv("T4_Shoulder_"+side, (0.285*sx,0,1.47), (0.12,0.12,0.15), JACKET), "upper_arm."+side)]
    parts += [(uv("T4_UpperArm_"+side, (0.43*sx,0,1.32), (0.095,0.095,0.23), JACKET), "upper_arm."+side)]
    parts += [(uv("T4_Forearm_"+side, (0.61*sx,-0.005,1.12), (0.075,0.075,0.22), JACKET), "forearm."+side)]
    parts += [(uv("T4_Hand_"+side, (0.755*sx,-0.01,0.99), (0.06,0.045,0.105), SKIN), "hand."+side)]
    parts += [(uv("T4_Thigh_"+side, (0.14*sx,0,0.74), (0.115,0.12,0.30), TROUSER), "thigh."+side)]
    parts += [(uv("T4_Shin_"+side, (0.15*sx,0,0.34), (0.09,0.10,0.27), TROUSER), "shin."+side)]
    shoe = uv("T4_Shoe_"+side, (0.15*sx,-0.085,0.08), (0.105,0.19,0.075), SHOE)
    parts += [(shoe, "foot."+side)]

# Face: eyes, irises, eyelids, nose, ears, brows and mouth
for side, sx in (("L",1),("R",-1)):
    eye = uv("T4_Eye_"+side, (0.054*sx,-0.119,1.825), (0.036,0.018,0.025), WHITE, 32, 18)
    iris = uv("T4_Iris_"+side, (0.054*sx,-0.138,1.825), (0.014,0.006,0.014), IRIS, 24, 16)
    brow = cube("T4_Brow_"+side, (0.055*sx,-0.14,1.875), (0.043,0.008,0.008), HAIR, 0.008)
    brow.rotation_euler.y = -0.08*sx
    ear = uv("T4_Ear_"+side, (0.145*sx,-0.002,1.79), (0.022,0.018,0.052), SKIN)
    for o in (eye,iris,brow,ear): parent_bone(o,arm,"head")
nose = uv("T4_Nose", (0,-0.145,1.785), (0.026,0.035,0.047), SKIN)
mouth = cube("T4_Mouth", (0,-0.142,1.735), (0.045,0.006,0.008), SKIN, 0.006)
parent_bone(nose,arm,"head"); parent_bone(mouth,arm,"head")

# Hair cap + optional beard object
hair = uv("T4_Hair_Style_01", (0,0.008,1.895), (0.151,0.13,0.09), HAIR)
hair["team4_customization"] = "hair"; parent_bone(hair,arm,"head")
beard = uv("T4_Beard_Style_01", (0,-0.105,1.715), (0.105,0.038,0.075), HAIR)
beard["team4_customization"] = "beard"; beard.hide_viewport = True; beard.hide_render = True
parent_bone(beard,arm,"head")

# Jacket panels, collar, belt and watch are independent customization slots
left_panel = cube("T4_Jacket_Left", (0.13,-0.115,1.31), (0.12,0.025,0.28), JACKET, 0.035)
right_panel = cube("T4_Jacket_Right", (-0.13,-0.115,1.31), (0.12,0.025,0.28), JACKET, 0.035)
for o in (left_panel,right_panel):
    o["team4_customization"] = "outfit"
    parent_bone(o,arm,"chest")
lapel_l = cube("T4_Lapel_L", (0.075,-0.151,1.43), (0.055,0.015,0.13), SHIRT, 0.018)
lapel_r = cube("T4_Lapel_R", (-0.075,-0.151,1.43), (0.055,0.015,0.13), SHIRT, 0.018)
lapel_l.rotation_euler.y=0.30; lapel_r.rotation_euler.y=-0.30
for o in (lapel_l,lapel_r): parent_bone(o,arm,"chest")
belt = cyl("T4_Belt", (0,0,1.00), 0.225, 0.055, SHOE, rotation=(math.radians(90),0,0), verts=48)
parent_bone(belt,arm,"pelvis")
watch = cyl("T4_Watch", (0.69,0,1.075), 0.058, 0.025, METAL, rotation=(0,math.radians(90),0), verts=32)
watch["team4_customization"]="accessory"; parent_bone(watch,arm,"forearm.L")

for obj,bn in parts:
    parent_bone(obj,arm,bn)

arm["team4_character_version"] = "2.0"
arm["team4_style"] = "semi_realistic"
arm["team4_slots"] = "hair,beard,outfit,shoes,accessories"
arm["team4_web_target"] = "GLB"
arm["team4_poly_budget"] = "30000-45000"

# Animation actions
def action(name, frames, poses):
    bpy.context.view_layer.objects.active = arm
    arm.animation_data_create()
    act = bpy.data.actions.get(name) or bpy.data.actions.new(name)
    arm.animation_data.action = act
    for frame in frames:
        values = poses.get(frame,{})
        for bone_name, rot in values.items():
            pb = arm.pose.bones.get(bone_name)
            if not pb: continue
            pb.rotation_mode='XYZ'
            pb.rotation_euler=rot
            pb.keyframe_insert(data_path="rotation_euler", frame=frame)
    return act

idle = action("TEAM4_Idle", [1,30,60], {
    1: {"chest":(0,0,0),"head":(0,0,0)},
    30: {"chest":(0.018,0,0),"head":(-0.012,0,0)},
    60: {"chest":(0,0,0),"head":(0,0,0)}
})
walk = action("TEAM4_Walk", [1,13,25], {
    1: {"thigh.L":(0.42,0,0),"thigh.R":(-0.42,0,0),"shin.L":(-0.22,0,0),"upper_arm.L":(-0.35,0,0),"upper_arm.R":(0.35,0,0)},
    13: {"thigh.L":(-0.42,0,0),"thigh.R":(0.42,0,0),"shin.R":(-0.22,0,0),"upper_arm.L":(0.35,0,0),"upper_arm.R":(-0.35,0,0)},
    25: {"thigh.L":(0.42,0,0),"thigh.R":(-0.42,0,0),"shin.L":(-0.22,0,0),"upper_arm.L":(-0.35,0,0),"upper_arm.R":(0.35,0,0)}
})
sit = action("TEAM4_Sit", [1,24], {
    1: {"pelvis":(0,0,0),"thigh.L":(0,0,0),"thigh.R":(0,0,0)},
    24: {"pelvis":(-0.12,0,0),"thigh.L":(-1.45,0,0),"thigh.R":(-1.45,0,0),"shin.L":(1.38,0,0),"shin.R":(1.38,0,0)}
})
arm.animation_data.action = idle
bpy.context.scene.frame_start=1
bpy.context.scene.frame_end=60
bpy.context.scene.frame_set(1)

# Display organization
for obj in col.objects:
    if obj.type == 'MESH':
        obj["team4_export"] = True
bpy.context.view_layer.objects.active=arm
arm.select_set(True)

# Save safely. The user can export this collection as GLB after review.
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print("TEAM4 Character V2 created: modular body, rig and Idle/Walk/Sit actions")
