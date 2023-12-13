curl 'http://172.26.16.16:5000/api/3/action/resource_create' \
-H 'Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJKOWwwSEJZTUxFTC1OQWFVeHRwU29RTGVVOTB2UVNkN2ZDbkV6RUMyNHRVIiwiaWF0IjoxNzAwODExOTEwfQ._F2Mqm8G0sxmtWxmGrEVz1bXhQsCa8_wyTMaSGmJ6dg' \
--form upload=@filetoupload \
--form package_id=my_dataset

parent_dir="http://172.26.30.52/~klab-dataset-nas/nexco/Input_original_data/"