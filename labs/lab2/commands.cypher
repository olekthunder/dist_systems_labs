CREATE
(C1:Customers {name:'TEST'}),
(I1:Items {title: 'TEST'}),
(C1)-[:VIEWED]->(I1);

MATCH (c:Customers)-[:VIEWED]-(i:Items) RETURN c.name, i.title;