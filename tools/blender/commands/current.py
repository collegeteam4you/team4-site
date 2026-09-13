"""Create two realistic, game-ready interview armchairs.

Idempotent: rerunning replaces only the collection created by this command.
"""

import bpy
import math
from mathutils import Vector

COLLECTION_NAME = "TEAM4_REALISTIC_ARMCHAIRS"


def remove_collection(name):
    collection = bpy.data.collections.get(name)
    if not collection:
        return
    for obj in list(collection.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.collections.remove(collection)


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


def rounded_cube(name, location, scale, mat, bevel=0.12, collection=None):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = obj.modifiers.new("Soft rounded edges", "BEVEL")
    mod.width = bevel
    mod.segments = 4
    obj.data.materials.append(mat)
    if collection:
        for old in list(obj.users_collection):
            old.objects.unlink(obj)
        collection.objects.link(obj)
    return obj


def cylinder(name, location, radius, depth, mat, collection):
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=radius, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    for old in list(obj.users_collection):
        old.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


def create_armchair(prefix, x, y):
    fabric = material("TEAM4_Fabric_Charcoal", (0.035, 0.045, 0.055), roughness=0.82)
    cushion = material("TEAM4_Cushion_Dark", (0.075, 0.085, 0.095), roughness=0.72)
    metal = material("TEAM4_Metal_Black", (0.018, 0.02, 0.024), metallic=0.78, roughness=0.24)

    root = bpy.data.objects.new(prefix, None)
    collection.objects.link(root)
    root.location = (x, 0.15, 0)

    parts = []
    parts.append(rounded_cube(prefix+"_SeatBase", (x, 0.10, 0.68), (0.82, 0.72, 0.18), fabric, 0.15, collection))
    parts.append(rounded_cube(prefix+"_SeatCushion", (x, -0.02, 0.91), (0.68, 0.59, 0.16), cushion, 0.18, collection))
    back = rounded_cube(prefix+"_Back", (x, 0.61, 1.58), (0.78, 0.18, 0.72), fabric, 0.20, collection)
    back.rotation_euler.x = math.radians(-7)
    parts.append(back)
    parts.append(rounded_cube(prefix+"_BackCushion", (x, 0.38, 1.52), (0.62, 0.14, 0.56), cushion, 0.16, collection))
    parts.append(rounded_cube(prefix+"_Arm_L", (x-0.78, 0.10, 1.10), (0.16, 0.68, 0.35), fabric, 0.16, collection))
    parts.append(rounded_cube(prefix+"_Arm_R", (x+0.78, 0.10, 1.10), (0.16, 0.68, 0.35), fabric, 0.16, collection))

    for index, (dx, dy) in enumerate(((-0.61,-0.48),(0.61,-0.48),(-0.61,0.47),(0.61,0.47)), 1):
        leg = cylinder(prefix+f"_Leg_{index}", (x+dx, 0.10+dy, 0.34), 0.055, 0.50, metal, collection)
        leg.rotation_euler.y = math.radians(7 if dx < 0 else -7)
        parts.append(leg)

    for obj in parts:
        obj.parent = root
        obj["team4_asset"] = "interview_armchair"
    root["team4_asset"] = "interview_armchair"
    return root


remove_collection(COLLECTION_NAME)
collection = bpy.data.collections.new(COLLECTION_NAME)
bpy.context.scene.collection.children.link(collection)

left = create_armchair("TEAM4_Armchair_Left", -2.75, 0.0)
right = create_armchair("TEAM4_Armchair_Right", 2.75, 0.0)

# Keep the pair symmetrical and easy to reposition as whole assets.
left.rotation_euler.z = math.radians(-4)
right.rotation_euler.z = math.radians(4)

bpy.context.view_layer.objects.active = left
left.select_set(True)
right.select_set(True)

bpy.context.scene["team4_last_command"] = "realistic_interview_armchairs_v1"
print("Team4: two realistic interview armchairs created.")
