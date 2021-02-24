CREATE
// customers
(c1:Customers {name: 'Customer 1'}),
(c2:Customers {name: 'Customer 2'}),
(c3:Customers {name: 'Customer 3'}),
(c4:Customers {name: 'Customer 4'}),
(c5:Customers {name: 'Customer 5'}),
// items
(i1:Items {title: 'Item 1'}),
(i2:Items {title: 'Item 2'}),
(i3:Items {title: 'Item 3'}),
(i4:Items {title: 'Item 4'}),
(i5:Items {title: 'Item 5'}),
(i6:Items {title: 'Item 6'}),
(i7:Items {title: 'Item 7'}),
// orders
// We will use neo4j node ID as unique identifier.
// Maybe it is bad, maybe not. I don't know.
(o1:Orders),
(o2:Orders),
(o3:Orders),
(o4:Orders),
(o5:Orders),
// relationships
// we don't have any requirements to track views, so let view be relationship.
// At first customer views some items, then order is created, items are added,
// order is ordered.
(c1)-[:VIEWED]->(i1),
(c1)-[:VIEWED]->(i2),
(o1)-[:CONTAINS]->(i2),
(c1)-[:ORDERED]->(o1),
(c2)-[:VIEWED]->(i5),
(c2)-[:VIEWED]->(i2),
(c2)-[:VIEWED]->(i3),
(o2)-[:CONTAINS]->(i3),
(o2)-[:CONTAINS]->(i5),
(c2)-[:ORDERED]->(o2),
(o3)-[:CONTAINS]->(i2),
(c2)-[:ORDERED]->(o3),
(c3)-[:VIEWED]->(i6),
(c3)-[:VIEWED]->(i7),
(c4)-[:VIEWED]->(i7),
(c5)-[:VIEWED]->(i1),
(o4)-[:CONTAINS]->(i1),
(c5)-[:ORDERED]->(o4),
(c5)-[:VIEWED]->(i6),
(o5)-[:CONTAINS]->(i6),
(c5)-[:ORDERED]->(o5);


// I'd like to add some constraints, but they are in paid version of neo4j.
