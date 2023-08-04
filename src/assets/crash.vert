precision highp float;

attribute vec3 position;
attribute vec3 direction;
attribute vec3 center;

uniform float offset;
uniform mat4 worldViewProjection;

void main() {
    vec3 direct = direction.xyz;
    vec3 tPos = mix(center, position.xyz, 1.) + direct * offset;
    gl_Position = worldViewProjection * vec4(tPos, 1.0);
}