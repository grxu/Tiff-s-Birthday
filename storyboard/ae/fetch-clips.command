#!/bin/bash
# Downloads the Kling clips into storyboard/animatic/clips (double-click on a Mac).
cd "$(dirname "$0")/../animatic" && mkdir -p clips
[ -f clips/V1-02.mp4 ] || curl -sSfL -o clips/V1-02.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_085725_6ea9afd5-542b-4a7e-bf3f-ed1ae0f6a10f.mp4" && echo V1-02
[ -f clips/V1-03.mp4 ] || curl -sSfL -o clips/V1-03.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_085728_499d9244-18cd-48a5-8b27-1a29b833f118.mp4" && echo V1-03
[ -f clips/V1-04.mp4 ] || curl -sSfL -o clips/V1-04.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_085728_f09cc022-d25a-4668-9911-942ff2510cb9.mp4" && echo V1-04
[ -f clips/V1-08.mp4 ] || curl -sSfL -o clips/V1-08.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_085725_058da155-a9b1-486c-91f7-14de7ea70085.mp4" && echo V1-08
[ -f clips/PC-01.mp4 ] || curl -sSfL -o clips/PC-01.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_085725_c3eacc80-c39c-4dc2-b221-a58d0be2cbeb.mp4" && echo PC-01
[ -f clips/PC-02.mp4 ] || curl -sSfL -o clips/PC-02.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_085725_fbe58a9c-b088-4dc8-a38c-844ec933dffb.mp4" && echo PC-02
[ -f clips/PC-04.mp4 ] || curl -sSfL -o clips/PC-04.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_093722_afa787d5-1e2a-4610-a02d-f45711ce7d44.mp4" && echo PC-04
[ -f clips/PC-05.mp4 ] || curl -sSfL -o clips/PC-05.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_093721_82caaf01-b49c-4566-8405-4ed7ddc9a360.mp4" && echo PC-05
[ -f clips/DB1-01.mp4 ] || curl -sSfL -o clips/DB1-01.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_090444_5829fe06-5534-435d-bbc5-0bd7a07855c1.mp4" && echo DB1-01
[ -f clips/DB1-02.mp4 ] || curl -sSfL -o clips/DB1-02.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_090444_711d9575-234e-447b-a28b-b796384565f8.mp4" && echo DB1-02
[ -f clips/V2-02.mp4 ] || curl -sSfL -o clips/V2-02.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_090444_8efcc971-2085-44bb-b131-3b0e9600756c.mp4" && echo V2-02
[ -f clips/V2-04.mp4 ] || curl -sSfL -o clips/V2-04.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_094253_96fbfb50-8d46-444c-b691-f9d420d6a64d.mp4" && echo V2-04
[ -f clips/V2-05.mp4 ] || curl -sSfL -o clips/V2-05.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_094253_951e72b7-e391-4fe9-984b-28dac29c9dc7.mp4" && echo V2-05
[ -f clips/V2-08.mp4 ] || curl -sSfL -o clips/V2-08.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_094253_6a8663d9-0730-4b87-9147-cc2ff7a6809a.mp4" && echo V2-08
[ -f clips/V2-10.mp4 ] || curl -sSfL -o clips/V2-10.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_094253_2a045ae5-242d-44d8-be8f-38fd3650e769.mp4" && echo V2-10
[ -f clips/V3-05.mp4 ] || curl -sSfL -o clips/V3-05.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_094253_94b7b96d-7d47-4ab2-9c14-3e2ac43bffef.mp4" && echo V3-05
[ -f clips/V3-07.mp4 ] || curl -sSfL -o clips/V3-07.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_094253_70027d39-5df2-4d39-93d2-88efe211a5aa.mp4" && echo V3-07
[ -f clips/OU-01.mp4 ] || curl -sSfL -o clips/OU-01.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_094253_a2525a7b-2ce3-4897-a533-0c824cf0db4b.mp4" && echo OU-01
[ -f clips/OU-02.mp4 ] || curl -sSfL -o clips/OU-02.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_094253_340510bc-0e9b-47e7-b69c-df16b49a0089.mp4" && echo OU-02
[ -f clips/OU-05.mp4 ] || curl -sSfL -o clips/OU-05.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_094253_9cda6fc5-1be3-424b-ad1e-af42b1d08bbe.mp4" && echo OU-05
[ -f clips/OU-06.mp4 ] || curl -sSfL -o clips/OU-06.mp4 "https://d8j0ntlcm91z4.cloudfront.net/user_3F9g5MvyxWEcBzuFjPmI97hrMM7/hf_20261011_094253_a6a5c36d-ed9e-4f59-9539-1165ea10e508.mp4" && echo OU-06
