#ifdef GL_ES
precision highp float;
#endif

uniform float farmostDepth;

void main()
{
    float zbuffer = gl_FragCoord.z * gl_FragCoord.w * farmostDepth;
    gl_FragColor = vec4(zbuffer, zbuffer, zbuffer, 1.0);
}
