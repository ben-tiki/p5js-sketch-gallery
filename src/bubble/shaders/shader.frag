#ifdef GL_ES
    precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_amp;

#define PI 3.1415926535897932384626433832795

// intersects a ray with a sphere and returns intersection details.
bool intersectSphere(vec3 originPosition, vec3 ray, float radius, out float backgroundMoveSpeed, out vec3 normal) {
    vec3 toSphere = -originPosition;
    float radiusSquared = radius * radius;
    float closestApproach = dot(toSphere, ray);
    float distanceSquared = dot(toSphere, toSphere) - closestApproach * closestApproach;
    if (closestApproach < 0.0 || distanceSquared > radiusSquared) return false;
    float halfChord = sqrt(radiusSquared - distanceSquared);
    backgroundMoveSpeed = closestApproach - halfChord;
    normal = normalize(originPosition + ray * backgroundMoveSpeed);
    return true;
}

// calculates the Fresnel lens effect given the incident ray and surface normal.
float fresnelLens(vec3 ray, vec3 normal) {
    float reflectivity = 0.0;
    float scale = 2.5;
    float power = 1.5;

    reflectivity = scale * pow(1.0 + dot(ray, normal), power);
    return clamp(reflectivity, 0.0, 1.0);
}

// helpers
float wavePattern(vec2 uv, float frequency, float speed) {
    return sin(uv.x * frequency + u_time * speed) * cos(uv.y * frequency + u_time * speed);
}

vec3 background(vec3 ray) {
    const vec3 baseColor = vec3(0.1, 0.4, 0.6);

    vec3 color = baseColor;

    vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;

    // added wave pattern
    float wave1 = wavePattern(uv, 1.0, 0.1) * 1.5 + 0.5;

    // color
    color = mix(color, vec3(wave1), 0.05);

    return color;
}

void main() {
    vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;

    vec3 originPosition = vec3(sin(u_time / 3.0) * 0.3, sin(u_time / 5.0) * 0.2, -2.0 + sin(u_time / 1.6) * 0.3);
    vec3 ray = normalize(vec3(uv.xy, 1.0));
    float distort = pow(sin(u_time / 3.0), 7.0) * 0.03 + u_amp * 0.5;
    float radius = 1.0 + sin(7.0 * (ray.x + u_time / 3.0))* distort + cos(11.0 * (ray.y + u_time / 5.0)) * distort;
    float backgroundMoveSpeed;
    vec3 normal;

    if (intersectSphere(originPosition, ray, radius, backgroundMoveSpeed, normal)) {
        float reflectCoeff = fresnelLens(ray, normal);
        float refractionFactor = pow(abs(normal.z), 10.0) * 0.5;
        vec3 reflectedRay = reflect(ray, normal);
        vec3 refractedRay = refract(ray, normal, 1.0);
        vec3 reflectedColor = background(reflectedRay);
        vec3 refractedColor = background(refractedRay);
        vec3 internalColor = mix(refractedColor, vec3(1.0), refractionFactor);
        vec3 lightDirection = normalize(vec3(-0.5, 0.5, 0));
        float lightDampen = pow(max(0.0, dot(reflectedRay, lightDirection)), 10.0) * 0.5;
        vec3 color = mix(internalColor, reflectedColor, reflectCoeff) + lightDampen;
        gl_FragColor = vec4(color, 1.0);

    } else {
        gl_FragColor = vec4(background(ray), 1.0);
    }
}