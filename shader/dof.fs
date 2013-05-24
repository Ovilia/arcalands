#ifdef GL_ES
precision highp float;
#endif

#define MAX_RADIUS 20
#define MAX_RADIUS_F 20.0
#define MAX_LENGTH 40

varying vec2 vUv;

uniform sampler2D texture;
uniform sampler2D depth;

uniform float wSplitCnt;
uniform float hSplitCnt;

// 0 for forward-mapped, 1 for reversed-mapped, 2 for layered
// default 0
uniform int algorithm;

// following uniforms are in world space
uniform float clipNear;
uniform float clipFar;
uniform float focusDistance;

#define focalLength 100.0
#define minC 500.0
#define maxC 2000.0
#define aperture 50.0
#define maxBlur 10.0

// get world depth position from screen depth information
// screenDepth from 0.0 to 1.0
float getWorldDepth(float screenDepth) {
    return (1.0 - screenDepth) * (clipFar - clipNear) + clipNear;
}

// get blur coc from world depth
float getCoc(float worldDepth) {
    float cWorld = abs(focusDistance * focalLength * aperture /
            (focusDistance - focalLength)
            * (1.0 - focusDistance / worldDepth));
    if (cWorld < minC) {
        return 0.0;
    } else if (cWorld < maxC) {
        return maxBlur * (cWorld - minC) / (maxC - minC);
    } else {
        return maxBlur;
    }
}

// blur using forward-mapped algorithm, return blurred color
vec4 getForwardResult(float thisCoc, float thisDepth) {
    vec3 sum;
    float weightSum = 0.0;
    int cnt = 0;
    int cocInt = int(maxBlur);
    int cocLength = 2 * cocInt;
    for (int i = 0; i < 20; ++i) {
        if (i < cocLength) {
            for (int j = 0; j < 20; ++j) {
                if (j < cocLength) {
                    if (i == cocInt && j == cocInt) {
                        // this pixel
                        float weight = maxBlur * maxBlur;
                        sum += texture2D(texture, vUv).rgb * weight;
                        weightSum += weight;
                        cnt += 1;
                    } else {
                        vec2 neighbor = vec2(
                                vUv.x + (float(i) - maxBlur) / wSplitCnt,
                                vUv.y + (float(j) - maxBlur) / hSplitCnt);
                        
                        float neighborDepth = texture2D(depth, neighbor).r;
                        float neighborZWorld = getWorldDepth(neighborDepth);
                        int neighborCoc = int(getCoc(neighborZWorld));
                        
                        // blur if this is inside neighbor's coc
                        if (i - neighborCoc <= cocInt
                                && i + neighborCoc >= cocInt
                                && j - neighborCoc <= cocInt
                                && j + neighborCoc >= cocInt) {
                            if (neighborDepth > thisDepth - 0.0001) {
                                float weight = maxBlur * maxBlur
                                        - float(neighborCoc - i)
                                        * float(neighborCoc - i);
                                sum += texture2D(texture, neighbor).rgb
                                        * weight;
                                weightSum += weight;
                                cnt += 1;
                            }
                        }
                    }
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }
    
    if (cnt == 0) {
        return texture2D(texture, vUv);
    } else {
        float cntFloat = float(cnt);
        return vec4(sum.r / weightSum, sum.g / weightSum,
                sum.b / weightSum, 1.0);
    }
}

// blur using reversed-mapped algorithm, return blurred color
vec4 getReversedResult(float thisCoc) {
    vec4 sum;
    int cnt = 0;
    int cocLength = 2 * int(thisCoc);
    for (int i = 0; i < MAX_RADIUS; ++i) {
        if (i < cocLength) {
            for (int j = 0; j < MAX_RADIUS; ++j) {
                if (j < cocLength) {
                    vec2 neighbor = vec2(
                            vUv.x + (float(i) - thisCoc) / wSplitCnt,
                            vUv.y + (float(j) - thisCoc) / hSplitCnt);
                    sum += texture2D(texture, neighbor);
                    cnt += 1;
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }
    
    if (cnt == 0) {
        return texture2D(texture, vUv);
    } else {
        float cntFloat = float(cnt);
        return vec4(sum.r / cntFloat, sum.g / cntFloat,
                sum.b / cntFloat, 1.0);
    }
}

void main() {
    float thisDepth = texture2D(depth, vUv).r;
    float zWorld = getWorldDepth(thisDepth);
    float thisCoc = getCoc(zWorld);
    
    // do blur
    if (algorithm == 1) {
        gl_FragColor = getReversedResult(thisCoc);
    } else {
        gl_FragColor = getForwardResult(thisCoc, thisDepth);
    }
    //gl_FragColor = texture2D(depth, vUv);
}
