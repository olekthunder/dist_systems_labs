#!/bin/bash
echo "sleeping for 10 seconds"
sleep 10

echo mongo_setup.sh time now: `date +"%T" `
mongo --host m1:8001 <<EOF
  var cfg = {
    "_id": "rs0",
    "version": 1,
    "members": [
      {
        "_id": 0,
        "host": "m1:8001",
      },
      {
        "_id": 1,
        "host": "m2:8002",
      },
      {
        "_id": 2,
        "host": "m3:8003",
      }
    ]
  };
  rs.initiate(cfg);
EOF
