# SimPoint

This page describes what the SimPoints category is.

In order to increase the speed of gem5 simulations, we use a sampling method known as SimPoints. This methodology divides the program into similar phases, and finds a single continuous window of executed instructions that match the whole program's execution, so that this smaller window of execution can be used for simulation instead of executing the program to completion, rapidly increasing the speed of simulation.

The SimPoints paper can be found [here](https://cseweb.ucsd.edu//~calder/papers/ASPLOS-02-SimPoint.pdf)

In combination with gem5 Workloads, we can distribute binaries with SimPoint information and gem5 Checkpoints. These can then be executed via the SimPoint API, thus producing faster simulation runs.

SimPoint source code for the gem5 Standard Library can be found [here](https://github.com/gem5/gem5/blob/stable/src/python/gem5/utils/simpoint.py)

Examples of using SimPoints with gem5 can be found in [`configs/example/gem5_library/checkpoints/simpoints-se-checkpoint.py`](https://github.com/gem5/gem5/blob/stable/configs/example/gem5_library/checkpoints/simpoints-se-checkpoint.py) and [`configs/example/gem5_library/checkpoints/simpoints-se-restore.py`](https://github.com/gem5/gem5/blob/stable/configs/example/gem5_library/checkpoints/simpoints-se-restore.py).
