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

uniform float focusDistance;
uniform float focalLength;

uniform float clipNear;
uniform float clipFar;

uniform int maxCoc;
uniform float layerCount;

void main() {
    // depth was from 0.0 to 1.0
    // map it in world space, which is from clipNear to clipFar
    float zbuffer = (1.0 - texture2D(depth, vUv).r) * (clipFar - clipNear)
            + clipNear;
    
    // calculate CoC
    //int coc = int(abs(zbuffer - focusDistance) * MAX_RADIUS_F /
    //              max(clipFar - focusDistance, focusDistance - clipNear));
    float distance = abs(zbuffer - focusDistance);
    if (distance < focalLength / 2.0) {
        distance = 0.0;
    } else {
        distance -= focalLength / 2.0;
    }
    int coc = int (distance / (clipFar - clipNear - focalLength) * float(maxCoc));
    coc = coc < maxCoc ? coc : maxCoc;
    int cocDouble = coc * 2;
    
    
    vec4 sum;
    float cnt = 0.0;
    int maxCocDouble = maxCoc * 2;
    for (int i = 0; i < MAX_LENGTH; ++i) {
        if (i > cocDouble) {
            break;
        }
        for (int j = 0; j < MAX_LENGTH; ++j) {
            if (j > cocDouble) {
                break;
            }
            vec2 neighbor = vec2(vUv.x + float(i - coc) / wSplitCnt,
                                 vUv.y + float(j - coc) / hSplitCnt);
            // blur those in front
            //if (texture2D(depth, neighbor).z - texture2D(depth, vUv).z > 0.001) {
            if (abs(texture2D(depth, neighbor).z - texture2D(depth, vUv).z)
                    < 1.0 / layerCount) {
                sum += texture2D(texture, neighbor);
                cnt += 1.0;
            }
        }
    }
    
    // spreading
    /*
    for (int i = 0; i < MAX_LENGTH; ++i) {
        if (i > maxCocDouble) {
            break;
        }
        for (int j = 0; j < MAX_LENGTH; ++j) {
            if (j > maxCocDouble) {
                break;
            }
            vec2 neighbor = vec2(vUv.x + float(i - maxCoc) / wSplitCnt,
                                 vUv.y + float(j - maxCoc) / hSplitCnt);
            float depthDelta = texture2D(depth, vUv).r
                    - texture2D(depth, neighbor).r;
            if (depthDelta < 0.0
                    || (depthDelta > 0.0 && depthDelta < 1.0 / layerCount)) {
                float zbufferN = (1.0 - texture2D(depth, neighbor).r)
                        * (clipFar - clipNear) + clipNear;
                // coc of neighbor
                float cocN = abs(zbufferN - focusDistance) * float(maxCoc) /
                        max(clipFar - focusDistance, focusDistance);
                if (float(i - maxCoc) < cocN && float(i - maxCoc) > -cocN
                        && float(j - maxCoc) < cocN && float(j - maxCoc) > -cocN) {
                    sum += texture2D(texture, neighbor);
                    cnt += 0.01;
                }
            }
        }
    }*/
    
    vec4 color;
    if (cnt > 0.0) {
        color = sum / cnt;
    } else {
        color = texture2D(texture, vUv);
    }
    float c = cnt;
    float cc = float(cocDouble);
    gl_FragColor = color;
}