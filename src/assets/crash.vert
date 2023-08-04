precision highp float;

attribute vec3 position;
attribute vec3 direction;
attribute vec3 center;

uniform float animation;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 worldViewProjection;

void main() {
    vec3 offset = direction.xyz;
    vec3 tPos = mix(center, position.xyz, 4.) + offset * .1;
    gl_Position = worldViewProjection * vec4(tPos, 1.0);
}