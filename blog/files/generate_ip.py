#!/usr/bin/env python
# -*- coding: utf-8 -*-

import random

for i in range(10000):
	n = 4
	if i % 1000 == 0:
		n = 20
	a = random.randint(1, 255)
	b = random.randint(0, 255)
	c = random.randint(0, 255)
	d = random.randint(0, 255)
	for j in range(random.randint(1, n)):
		print(str(a)+"."+str(b)+"."+str(c)+"."+str(d))