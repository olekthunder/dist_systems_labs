#!/bin/bash
echo mongo_setup.sh time now: `date +"%T" `

# configure configserver
/scripts/wait-for-it.sh mc:8010 && mongo --host mc:8010 <<EOF
  rs.initiate({
    _id: "confg",
    configsvr: true,
    members: [{_id: 0, host: "mc:8010"}],
  })
EOF

# configure shards, I am bad at bash
/scripts/wait-for-it.sh m1:8001 && mongo --host "m1:8001" <<EOF
  rs.initiate({
    _id: "rs1",
    members: [{_id: 0, host: "m1:8001" }]
  })
EOF
/scripts/wait-for-it.sh m2:8002 && mongo --host "m2:8002" <<EOF
  rs.initiate({
    _id: "rs2",
    members: [{_id: 0, host: "m2:8002" }]
  })
EOF
/scripts/wait-for-it.sh m3:8003 && mongo --host "m3:8003" <<EOF
  rs.initiate({
    _id: "rs3",
    members: [{_id: 0, host: "m3:8003" }]
  })
EOF

sleep 10

# configure router
mongo --host "mrouter:8100" <<EOF
  sh.addShard("rs1/m1:8001");
  sh.addShard("rs2/m2:8002");
  sh.addShard("rs3/m3:8003");
EOF
